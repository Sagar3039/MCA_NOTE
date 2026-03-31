"use client";

import React, { useState, useEffect } from 'react';
import { Notice } from '@/lib/types';
import { NoticeCard } from './NoticeCard';
import { Loader2, RefreshCcw, LayoutGrid } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function NoticeList() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNotices = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/notices');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setNotices(data.notices);
    } catch (err) {
      setError('Could not retrieve notices.');
    } finally {
      setLoading(false);
    }
  };

  const handleManualScrape = async () => {
    try {
      setRefreshing(true);
      const res = await fetch('/api/scrape', { method: 'POST' });
      if (!res.ok) throw new Error('Scrape failed');
      await fetchNotices();
    } catch (err) {
      setError('Manual sync failed.');
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        <p className="text-muted-foreground font-semibold animate-pulse tracking-wide uppercase text-xs">Syncing College Portal...</p>
      </div>
    );
  }

  const featuredNotices = notices.slice(0, 2);
  const allNotices = notices.slice(2);

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* Featured Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-[#1a2b3c]">Featured Updates</h2>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleManualScrape} 
            disabled={refreshing}
            className="rounded-full hover:bg-white/50 text-muted-foreground"
          >
            <RefreshCcw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Sync Now
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {featuredNotices.map((notice) => (
            <NoticeCard 
              key={notice.id} 
              notice={notice} 
              isLatest={true} 
            />
          ))}
        </div>
      </section>

      {/* All Notices Section */}
      <section className="space-y-6">
        <div className="flex items-center gap-2 mb-6">
          <LayoutGrid className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-bold text-[#1a2b3c]">Recent Announcements</h2>
        </div>
        
        {allNotices.length === 0 ? (
          <div className="text-center py-20 bg-white/30 rounded-[2.5rem] border-2 border-dashed border-white/50">
            <p className="text-xl font-bold text-muted-foreground/60">No additional notices found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {allNotices.map((notice) => (
              <NoticeCard 
                key={notice.id} 
                notice={notice} 
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
