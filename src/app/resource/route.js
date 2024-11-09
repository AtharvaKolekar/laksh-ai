import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  
  if (!query) {
    return NextResponse.redirect(new URL('/', request.url), { status: 302 });
  }

  const url = `https://www.google.com/search?&btnI=I'm+feeling+lucky&q=${encodeURIComponent(query)}`;

  try {
    const response = await fetch(url, { method: 'GET', redirect: 'manual' });
    const redirectedUrl = response.headers.get('location');
    
    if (!redirectedUrl) {
      return NextResponse.redirect(new URL('/', request.url), { status: 302 });
    }
    const actualUrl = redirectedUrl.replace('https://www.google.com/url?q=', '');
    const headers = new Headers();
    headers.set('Location', actualUrl); 
    return NextResponse.redirect(actualUrl, { status: 302 });

  } catch (error) {
    console.error("Error fetching URL:", error);
    return NextResponse.redirect(new URL('/', request.url), { status: 302 });
  }
}
