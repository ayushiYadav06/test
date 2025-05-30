// src/app/api/callback/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const callbackData = await request.json();
    console.log('Callback data received:', callbackData);

    // Respond with a success status  
    return NextResponse.json({ message: 'Callback received successfully', data: callbackData });

  } catch (error) {
    console.error('Error handling callback:', error);
    return NextResponse.json({ error: 'Error handling callback' }, { status: 500 });
  }
}
