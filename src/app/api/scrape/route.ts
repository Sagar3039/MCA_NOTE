
import { NextResponse } from 'next/server';
import { setCachedNotices } from '@/lib/cache';
import { scrapeNotices } from '@/lib/scraper';

export async function POST() {
  try {
    const notices = await scrapeNotices(5);
    setCachedNotices({ notices, lastUpdated: Date.now() });
    return NextResponse.json({ success: true, count: notices.length });
  } catch (error) {
    return NextResponse.json({ error: 'Scrape job failed' }, { status: 500 });
  }
}
