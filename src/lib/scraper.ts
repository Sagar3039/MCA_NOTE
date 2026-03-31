import * as cheerio from 'cheerio';
import { Notice } from './types';

export async function scrapeNotices(pages: number = 5): Promise<Notice[]> {
  const allNotices: Notice[] = [];
  const baseUrl = 'https://midnaporecollege.ac.in/category/notice/';

  try {
    for (let i = 1; i <= pages; i++) {
      const url = i === 1 ? baseUrl : `${baseUrl}page/${i}/`;
      const response = await fetch(url, {
        next: { revalidate: 0 },
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        }
      });

      if (!response.ok) break;

      const html = await response.text();
      const $ = cheerio.load(html);

      $('.type-post').each((_, element) => {
        const titleElement = $(element).find('.entry-title a');
        const title = titleElement.text().trim();
        const link = titleElement.attr('href') || '';
        const date = $(element).find('.entry-meta').text().trim();
        
        if (title && link) {
          allNotices.push({
            id: Buffer.from(link).toString('base64'),
            title,
            link,
            date,
          });
        }
      });
    }

    return allNotices;
  } catch (error) {
    console.error('Scraping failed:', error);
    throw error;
  }
}

/**
 * Scrapes the full content and attachment links of a specific notice page.
 */
export async function scrapeNoticeContent(url: string): Promise<{ content: string; attachmentUrl: string | null }> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      }
    });

    if (!response.ok) throw new Error('Failed to fetch notice page');

    const html = await response.text();
    const $ = cheerio.load(html);

    // Look for PDF or Image links in the content
    let attachmentUrl: string | null = null;
    
    // Priority 1: Direct PDF links
    $('a').each((_, el) => {
      const href = $(el).attr('href');
      if (href && href.toLowerCase().endsWith('.pdf')) {
        attachmentUrl = href;
        return false; // Break
      }
    });

    // Priority 2: Direct Image links if no PDF found
    if (!attachmentUrl) {
      $('a').each((_, el) => {
        const href = $(el).attr('href');
        if (href && (href.toLowerCase().match(/\.(jpg|jpeg|png|gif)$/))) {
          attachmentUrl = href;
          return false; // Break
        }
      });
    }

    // Priority 3: Embedded images
    if (!attachmentUrl) {
      const imgSrc = $('.entry-content img').first().attr('src');
      if (imgSrc) attachmentUrl = imgSrc;
    }

    const content = $('.entry-content').text().trim() || 
                    $('.post-content').text().trim() || 
                    $('article').text().trim();

    return { content, attachmentUrl };
  } catch (error) {
    console.error('Scraping content failed:', error);
    return { content: '', attachmentUrl: null };
  }
}
