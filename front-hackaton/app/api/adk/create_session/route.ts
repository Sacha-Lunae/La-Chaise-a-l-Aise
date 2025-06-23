// app/api/adk/create_session/route.ts

import { NextRequest, NextResponse } from 'next/server';

const ADK_BASE_URL = process.env.ADK_BASE_URL || 'https://adk-default-service-name-670631922839.europe-west1.run.app';

export async function POST(req: NextRequest) {
  try {
    const { userId, sessionId, state } = await req.json();
    console.log('ROUTECREATESESS: Payload received from client:', { userId, sessionId, state: '...' }); // Partial log to avoid flooding

    const adkPayload = {
      state: state
    };
    
    console.log('ROUTECREATESESS: Calling ADK API at URL:', `${ADK_BASE_URL}/apps/chair_agent/users/${userId}/sessions/${sessionId}`);
    const adkResponse = await fetch(
      `${ADK_BASE_URL}/apps/chair_agent/users/${userId}/sessions/${sessionId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(adkPayload)
      }
    );

    const adkData = await adkResponse.json();
    console.log('ROUTECREATESESS: RAW response from ADK (session):', adkData);

    if (adkResponse.ok) {
      return NextResponse.json({ success: true, session_id: adkData.id }, { status: 200 });
    } else {
      console.error('ROUTECREATESESS: ADK Session API Error:', adkResponse.status, adkData);
      return NextResponse.json(
        { 
          success: false, 
          error: adkData.error || `ADK Error: ${adkResponse.status} - ${JSON.stringify(adkData)}` 
        }, 
        { status: adkResponse.status }
      );
    }
  } catch (error) {
    console.error('ROUTECREATESESS: Proxy create_session error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: `Network or internal error: ${error instanceof Error ? error.message : 'Unknown error'}` 
      }, 
      { status: 500 }
    );
  }
}