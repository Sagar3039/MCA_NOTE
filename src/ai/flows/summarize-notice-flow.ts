'use server';
/**
 * @fileOverview An AI agent that summarizes college notices.
 *
 * - summarizeNotice - A function that handles the notice summarization process.
 * - verifyApiKey - A utility function to check if a provided Gemini API key is valid.
 * - SummarizeNoticeInput - The input type for the summarizeNotice function.
 * - SummarizeNoticeOutput - The return type for the summarizeNotice function.
 */

import {ai} from '@/ai/genkit';
import {z, genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

const SummarizeNoticeInputSchema = z.object({
  title: z.string().describe('The title of the college notice.'),
  content: z.string().optional().describe('The full content/document text of the college notice.'),
  apiKey: z.string().optional().describe('Optional: User provided Gemini API key.'),
});
export type SummarizeNoticeInput = z.infer<typeof SummarizeNoticeInputSchema>;

const SummarizeNoticeOutputSchema = z.object({
  summary: z.string().describe('A concise, AI-generated summary of the notice based on the provided title and document content.'),
});
export type SummarizeNoticeOutput = z.infer<typeof SummarizeNoticeOutputSchema>;

/**
 * Summarizes a college notice using either the default AI instance or a user-provided API key.
 */
export async function summarizeNotice(input: SummarizeNoticeInput): Promise<SummarizeNoticeOutput> {
  return summarizeNoticeFlow(input);
}

/**
 * Verifies if a Gemini API key is valid by making a simple test request.
 */
export async function verifyApiKey(apiKey: string): Promise<{ success: boolean; message: string }> {
  try {
    const customAi = genkit({
      plugins: [googleAI({ apiKey })],
      model: 'googleai/gemini-2.5-flash',
    });
    
    const { text } = await customAi.generate({
      prompt: 'Respond with exactly "OK" if you are working.',
    });
    
    if (text.trim().toUpperCase().includes('OK')) {
      return { success: true, message: 'API key verified successfully!' };
    }
    return { success: false, message: 'The AI responded but did not return the expected verification signal.' };
  } catch (error: any) {
    console.error('API Key Verification Error:', error);
    return { 
      success: false, 
      message: error?.message || 'Failed to verify API key. Please check the key and your network connection.' 
    };
  }
}

const summarizeNoticePrompt = ai.definePrompt({
  name: 'summarizeNoticePrompt',
  input: {schema: SummarizeNoticeInputSchema},
  output: {schema: SummarizeNoticeOutputSchema},
  prompt: `You are an expert at summarizing college notices. 
Your goal is to provide a concise, informative summary that highlights key dates, requirements, and actions students need to take.

Title: {{{title}}}

Document Content:
{{#if content}}
{{{content}}}
{{else}}
(No full document content provided, please summarize based on the title only)
{{/if}}

Provide a 2-3 sentence summary that is easy for a student to understand.`,
});

const summarizeNoticeFlow = ai.defineFlow(
  {
    name: 'summarizeNoticeFlow',
    inputSchema: SummarizeNoticeInputSchema,
    outputSchema: SummarizeNoticeOutputSchema,
  },
  async (input) => {
    // If a custom API key is provided, we use a temporary Genkit instance to ensure the key is used
    if (input.apiKey && input.apiKey.trim() !== '') {
      const customAi = genkit({
        plugins: [googleAI({ apiKey: input.apiKey })],
        model: 'googleai/gemini-2.5-flash',
      });
      
      const { output } = await customAi.generate({
        prompt: `You are an expert at summarizing college notices. 
        Summarize the following notice into a few clear, informative sentences.
        
        Title: ${input.title}
        ${input.content ? `Full Document Content: ${input.content}` : '(Summarize based on title only)'}`,
        output: { schema: SummarizeNoticeOutputSchema }
      });
      
      if (!output) throw new Error('AI failed to generate a response with the provided key.');
      return output;
    }

    // Default behavior using the pre-configured global 'ai' instance
    const {output} = await summarizeNoticePrompt(input);
    if (!output) {
      throw new Error('Failed to generate summary.');
    }
    return output;
  }
);
