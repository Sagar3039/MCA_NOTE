import { NextRequest, NextResponse } from 'next/server';
import { scrapeNoticeContent } from '@/lib/scraper';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json({ error: 'URL parameter is required' }, { status: 400 });
  }

  try {
    const data = await scrapeNoticeContent(url);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch notice details' }, { status: 500 });
  }
}
