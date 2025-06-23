// app/api/adk/run_sse/route.ts

import { NextRequest, NextResponse } from 'next/server';

const ADK_BASE_URL = process.env.ADK_BASE_URL || 'https://adk-default-service-name-670631922839.europe-west1.run.app';

export async function POST(req: NextRequest) {
  try {
    // Dans l'App Router, on utilise await req.json() pour récupérer le corps de la requête.
    const messageData = await req.json();
    
    const response = await fetch(`${ADK_BASE_URL}/run_sse`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(messageData)
    });

    if (response.ok) {
      // Pour le streaming SSE, on lit la réponse comme du texte.
      const responseText = await response.text();
      
      // Parser la réponse SSE (format: "data: {...}")
      const lines = responseText.split('\n');
      let parsedData = null;
      
      for (const line of lines) {
        if (line.startsWith('data: ') && line !== 'data: ') {
          try {
            parsedData = JSON.parse(line.substring(6));
            break; // On prend la première donnée valide qu'on trouve
          } catch (e) {
            console.log('Failed to parse line:', line);
          }
        }
      }
      
      // On retourne une réponse JSON avec NextResponse
      return NextResponse.json({ 
        success: true, 
        response: parsedData 
      }, { status: 200 });

    } else {
      const errorText = await response.text();
      // En cas d'erreur, on retourne aussi un NextResponse avec le statut approprié
      return NextResponse.json({ 
        success: false, 
        error: `ADK Error: ${response.status} - ${errorText}` 
      }, { status: response.status });
    }
  } catch (error) {
    console.error('Proxy error:', error);
    // Gestion des erreurs générales avec NextResponse
    return NextResponse.json({ 
      success: false, 
      error: `Network error: ${error instanceof Error ? error.message : 'Unknown error'}` 
    }, { status: 500 });
  }
}