"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, Sparkles, Loader2, MoreHorizontal, User2 } from 'lucide-react';
import { Notice } from '@/lib/types';
import { summarizeNotice } from '@/ai/flows/summarize-notice-flow';
import { toast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface NoticeCardProps {
  notice: Notice;
  isLatest?: boolean;
}

const GRADIENTS = [
  'from-rose-400 to-orange-300',
  'from-teal-400 to-emerald-300',
  'from-blue-400 to-indigo-300',
  'from-purple-400 to-pink-300',
  'from-amber-400 to-yellow-300'
];

export function NoticeCard({ notice, isLatest }: NoticeCardProps) {
  const [summary, setSummary] = useState<string | null>(null);
  const [attachmentUrl, setAttachmentUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [showSummary, setShowSummary] = useState(false);

  // Random visual elements to match design
  const gradient = useMemo(() => GRADIENTS[Math.floor(Math.random() * GRADIENTS.length)], []);
  const progressValue = useMemo(() => 40 + Math.floor(Math.random() * 50), []);
  const viewerCount = useMemo(() => 10 + Math.floor(Math.random() * 200), []);

  const fetchDetails = async () => {
    const contentRes = await fetch(`/api/notices/content?url=${encodeURIComponent(notice.link)}`);
    if (!contentRes.ok) throw new Error('Failed to retrieve document content');
    return await contentRes.json();
  };

  const handleSummarize = async () => {
    if (summary) {
      setShowSummary(!showSummary);
      return;
    }

    setLoading(true);
    try {
      const { content: fullContent, attachmentUrl: fetchedUrl } = await fetchDetails();
      setAttachmentUrl(fetchedUrl);

      const apiKey = localStorage.getItem('gemini_api_key') || undefined;
      const result = await summarizeNotice({ 
        title: notice.title,
        content: fullContent,
        apiKey 
      });
      
      setSummary(result.summary);
      setShowSummary(true);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Summarization Error",
        description: error?.message || "Check your API key settings.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (attachmentUrl) {
      window.open(attachmentUrl, '_blank');
      return;
    }

    setDownloadLoading(true);
    try {
      const { attachmentUrl: fetchedUrl } = await fetchDetails();
      if (!fetchedUrl) {
        toast({ title: "Direct file not found", description: "Opening notice page." });
        window.open(notice.link, '_blank');
        return;
      }
      setAttachmentUrl(fetchedUrl);
      window.open(fetchedUrl, '_blank');
    } catch (error: any) {
      toast({ variant: "destructive", title: "Download failed" });
    } finally {
      setDownloadLoading(false);
    }
  };

  return (
    <Card className={`group relative bg-white/60 hover:bg-white border-white/50 shadow-sm transition-all duration-300 rounded-[2rem] overflow-hidden ${isLatest ? 'ring-2 ring-primary/20' : ''}`}>
      <CardContent className="p-6 space-y-6">
        {/* Header with Icon and Options */}
        <div className="flex items-start justify-between">
          <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-inner`}>
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <Sparkles className="text-white w-6 h-6" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isLatest ? 'bg-emerald-400' : 'bg-slate-300'}`} />
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-black/5">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Title and Metadata */}
        <div>
          <div className="flex items-center gap-3 text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">
            <span>{viewerCount} Students</span>
            <span className="w-1 h-1 bg-muted-foreground/30 rounded-full" />
            <span>5 Materials</span>
          </div>
          <h3 className="text-lg font-bold text-[#1a2b3c] leading-snug line-clamp-2 min-h-[3.5rem] group-hover:text-primary transition-colors">
            {notice.title}
          </h3>
          <p className="text-xs text-muted-foreground mt-2 line-clamp-2 italic">
            {showSummary ? summary : `Posted on ${notice.date}`}
          </p>
        </div>

        {/* Progress Section */}
        <div className="grid grid-cols-2 gap-8 items-end">
          <div className="space-y-2">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tight">Relevance</p>
            <div className="flex items-center gap-2">
              <Progress value={progressValue} className="h-1.5 flex-1" />
              <span className="text-[10px] font-bold text-slate-400">{progressValue}%</span>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tight text-right">Viewers</p>
            <div className="flex justify-end -space-x-2">
              {[1, 2, 3].map((i) => (
                <Avatar key={i} className="w-6 h-6 border-2 border-white">
                  <AvatarImage src={`https://picsum.photos/seed/${notice.id}${i}/50/50`} />
                  <AvatarFallback><User2 className="w-3 h-3" /></AvatarFallback>
                </Avatar>
              ))}
              <div className="w-6 h-6 rounded-full border-2 border-white bg-primary/10 text-primary flex items-center justify-center text-[8px] font-bold">
                +{viewerCount - 3}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="rounded-xl h-10 bg-white shadow-sm hover:shadow-md transition-all gap-2 text-xs font-bold"
            onClick={handleSummarize}
            disabled={loading}
          >
            {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3 text-primary" />}
            {showSummary ? 'Original' : 'AI Summary'}
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="rounded-xl h-10 bg-white shadow-sm hover:shadow-md transition-all gap-2 text-xs font-bold"
            onClick={handleDownload}
            disabled={downloadLoading}
          >
            {downloadLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Download className="w-3 h-3 text-primary" />}
            Doc
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
