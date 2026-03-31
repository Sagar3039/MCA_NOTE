
import { NextResponse } from 'next/server';
import { getCachedNotices, setCachedNotices } from '@/lib/cache';
import { scrapeNotices } from '@/lib/scraper';

export async function GET() {
  try {
    let cached = getCachedNotices();

    // If no cache, perform initial scrape
    if (!cached) {
      const notices = await scrapeNotices(3);
      cached = { notices, lastUpdated: Date.now() };
      setCachedNotices(cached);
    }

    return NextResponse.json(cached);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch notices' }, { status: 500 });
  }
}
