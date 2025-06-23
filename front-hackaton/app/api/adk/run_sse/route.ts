// app/api/adk/run_sse/route.ts

import { NextRequest, NextResponse } from 'next/server';

const ADK_BASE_URL = process.env.ADK_BASE_URL || 'https://adk-default-service-name-670631922839.europe-west1.run.app';

export async function POST(req: NextRequest) {
  try {
    const messageData = await req.json();
    console.log('ROUTESSESRV: MessageData received from client:', JSON.stringify(messageData, null, 2));

    // Specific check of 'parts' content if an image is present
    if (messageData.new_message && messageData.new_message.parts) {
      messageData.new_message.parts.forEach((part: any, index: number) => {
        if (part.inline_data) {
          console.log(`ROUTESSESRV: Part ${index} is an image. MimeType: ${part.inline_data.mime_type}, Base64 Size: ${part.inline_data.data.length}`);
          // console.log(`ROUTESSESRV: Image data (preview): ${part.inline_data.data.substring(0, 50)}...`); // Uncomment if preview is needed, mind log length
        } else if (part.text) {
          console.log(`ROUTESSESRV: Part ${index} is text: "${part.text}"`);
        }
      });
    }

    console.log('ROUTESSESRV: Calling ADK API at URL:', `${ADK_BASE_URL}/run_sse`);
    const adkResponse = await fetch(`${ADK_BASE_URL}/run_sse`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(messageData) // This is the payload sent to the ADK API
    });

    if (adkResponse.ok) {
      const responseText = await adkResponse.text();
      console.log('ROUTESSESRV: RAW response from ADK (ok):', responseText);

      // Process SSE response
      const lines = responseText.split('\n').filter(line => line.startsWith('data: '));
      let parsedData = null;
      if (lines.length > 0) {
        const lastDataLine = lines[lines.length - 1]; // Take the last non-empty "data:" line
        if (lastDataLine.trim() !== 'data:') {
          try {
            parsedData = JSON.parse(lastDataLine.substring(6));
            console.log('ROUTESSESRV: Last SSE line parsed:', parsedData);
          } catch (e) {
            console.error('ROUTESSESRV: Failed to parse SSE JSON:', lastDataLine, e);
          }
        }
      }

      // Build the response for the client (ADKApiService)
      const botResponseContent = parsedData?.content || { role: 'model', parts: [{ text: "Sorry, no text response found." }] };
      console.log('ROUTESSESRV: Final response built for client:', botResponseContent);

      return NextResponse.json({
        success: true,
        response: {
          role: botResponseContent.role,
          parts: botResponseContent.parts.map((part: any) => ({
            text: part.text || '',
            // If the ADK API returns images, they will be here.
            // Currently, MessageType only handles them for sending.
            // It would need to be adapted if the agent also returns images to display.
          }))
        }
      }, { status: 200 });

    } else {
      const errorText = await adkResponse.text();
      console.error('ROUTESSESRV: ADK API Error:', adkResponse.status, errorText);
      return NextResponse.json({
        success: false,
        error: `ADK Error: ${adkResponse.status} - ${errorText}`
      }, { status: adkResponse.status });
    }
  } catch (error) {
    console.error('ROUTESSESRV: Internal Route Handler error:', error);
    return NextResponse.json({
      success: false,
      error: `Network or internal error: ${error instanceof Error ? error.message : 'Unknown error'}`
    }, { status: 500 });
  }
}