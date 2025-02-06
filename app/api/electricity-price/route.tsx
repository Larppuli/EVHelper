import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get('date');
  const hour = searchParams.get('hour');

  if (!date || !hour) {
    return NextResponse.json({ error: 'Missing date or hour parameter' }, { status: 400 });
  }

  const apiUrl = `https://api.porssisahko.net/v1/price.json?date=${date}&hour=${hour}`;

  try {
    console.log(`Fetching price for ${date} ${hour} from ${apiUrl}`);
    const res = await fetch(apiUrl, {
      headers: { 'Content-Type': 'application/json' },
    });

    if (!res.ok) {
      console.error(`API request failed with status ${res.status} for ${date} ${hour}`);
      return NextResponse.json({ error: `API request failed with status ${res.status}` }, { status: res.status });
    }

    const data = await res.json();
    console.log(`Fetched price for ${date} ${hour}:`, data);
    return NextResponse.json({ data });
  } catch (error) {
    console.error(`Failed to fetch electricity price for ${date} ${hour}:`, error);
    return NextResponse.json({ error: 'Failed to fetch electricity price' }, { status: 500 });
  }
}