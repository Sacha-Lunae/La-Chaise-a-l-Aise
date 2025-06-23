// services/adk_api.ts

interface CustomerState {
  customer_id: string;
  first_name: string;
  last_name: string;
  email: string;
  preferred_language: string;
  loyalty_status: string;
  purchase_history: any[];
  basket: any[];
}

interface MessagePart {
  text?: string; // Can be optional if the part is only an image
  inline_data?: { // For base64 encoded images
    mime_type: string;
    data: string; // The raw base64 string
  };
}

interface NewMessage {
  role: 'user' | 'assistant';
  parts: MessagePart[];
}

// New interface for the complete payload sent to /run_sse
interface AdkRunSsePayload {
  app_name: string;
  user_id: string;
  session_id: string | null;
  new_message: NewMessage; // Here, new_message is of type NewMessage
  streaming: boolean;
}

interface SessionResponse {
  success: boolean;
  session_id?: string;
  error?: string;
}

interface MessageContent {
  role: string;
  parts: MessagePart[];
}

interface MessageResponse {
  success: boolean;
  response?: MessageContent;
  error?: string;
}

class ADKApiService {
  private userId: string;
  private sessionId: string | null = null;
  private isSessionCreated = false;

  constructor(userId: string = 'user_123') {
    this.userId = userId;
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Creates or retrieves a user session with the ADK API via the Next.js proxy.
   * @param customerData Optional data to customize the client state.
   * @returns A Promise object containing the success of the operation and the session ID or an error.
   */
  async createSession(customerData: Partial<CustomerState> = {}): Promise<SessionResponse> {
    if (this.isSessionCreated && this.sessionId) {
      console.log('ADKAPI: createSession - Session already exists, reusing.');
      return { success: true, session_id: this.sessionId };
    }

    this.sessionId = this.generateSessionId();
    const defaultCustomerData: CustomerState = {
      customer_id: this.userId,
      first_name: customerData.first_name || 'User',
      last_name: customerData.last_name || '',
      email: customerData.email || '',
      preferred_language: customerData.preferred_language || 'fr',
      loyalty_status: customerData.loyalty_status || 'Standard',
      purchase_history: customerData.purchase_history || [],
      basket: customerData.basket || []
    };

    try {
      const payloadToSend = {
        userId: this.userId,
        sessionId: this.sessionId,
        state: defaultCustomerData
      };
      console.log('ADKAPI: createSession - Payload sent to proxy /api/adk/create_session:', JSON.stringify(payloadToSend, null, 2));

      const response = await fetch('/api/adk/create_session', { // Route Handler path
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payloadToSend)
      });

      const result = await response.json();
      console.log('ADKAPI: createSession - Response from proxy /api/adk/create_session:', result);

      if (response.ok && result.success) { // Verify response.ok in addition to result.success
        this.isSessionCreated = true;
        return { success: true, session_id: result.session_id };
      } else {
        const errorMessage = result.error || `Error during session creation: ${response.status}`;
        console.error("ADKAPI: Error creating session via proxy:", errorMessage);
        return { success: false, error: errorMessage };
      }
    } catch (error) {
      console.error('ADKAPI: Network error during session creation:', error);
      return {
        success: false,
        error: `Network error: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  /**
   * Sends a text message or an image to the ADK API via the Next.js proxy.
   * @param text The text message to send.
   * @param image Optional: The base64 string of the image (with data:mime/type;base64, prefix).
   * @returns A Promise object containing the success of the operation and the agent's response or an error.
   */
  async sendMessage(text: string, image?: string): Promise<MessageResponse> {
    // Ensure a session exists before sending a message
    if (!this.isSessionCreated || !this.sessionId) {
      console.log('ADKAPI: sendMessage - Session not initialized. Attempting to create...');
      const sessionResult = await this.createSession();
      if (!sessionResult.success) {
        return { success: false, error: sessionResult.error };
      }
    }

    const messageParts: MessagePart[] = [];

    // Add text as a message part if not empty
    if (text.trim()) {
      messageParts.push({ text: text.trim() });
      console.log(`ADKAPI: sendMessage - Adding text part: "${text.trim()}"`);
    }

    // If an image is provided, add it as a part with `inline_data`
    if (image) {
      const [header, base64Data] = image.split(',');
      const mimeTypeMatch = header.match(/data:(.*?);base64/);
      const mime_type = mimeTypeMatch ? mimeTypeMatch[1] : 'application/octet-stream';

      messageParts.push({
        inline_data: {
          mime_type: mime_type,
          data: base64Data,
        }
      });
      console.log('ADKAPI: sendMessage - Adding image part. MimeType:', mime_type, 'Base64 Size:', base64Data.length);
    } else {
      console.log('ADKAPI: sendMessage - No image to add.');
    }

    // The complete payload to send to the /api/adk/run_sse Route Handler
    const messageData: AdkRunSsePayload = { // Type correction applied here
      app_name: 'chair_agent',
      user_id: this.userId,
      session_id: this.sessionId,
      new_message: {
        role: 'user',
        parts: messageParts
      },
      streaming: false
    };

    console.log('ADKAPI: sendMessage - Payload sent to proxy /api/adk/run_sse:', JSON.stringify(messageData, null, 2));

    try {
      const response = await fetch('/api/adk/run_sse', { // Route Handler path
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(messageData)
      });

      const result = await response.json();
      console.log('ADKAPI: sendMessage - Response from proxy /api/adk/run_sse:', result);

      if (response.ok && result.success && result.response) {
        return {
          success: true,
          response: result.response
        };
      } else {
        const errorMessage = result.error || `Error sending message: ${response.status}`;
        console.error("ADKAPI: Error sending message via proxy:", errorMessage);
        return { success: false, error: errorMessage };
      }
    } catch (error) {
      console.error('ADKAPI: Network error sending message:', error);
      return {
        success: false,
        error: `Network error: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  /**
   * Resets the local session state.
   */
  resetSession(): void {
    console.log('ADKAPI: Resetting session.');
    this.sessionId = null;
    this.isSessionCreated = false;
  }

  /**
   * Returns the current session ID.
   * @returns The session ID or null if not defined.
   */
  getCurrentSessionId(): string | null {
    return this.sessionId;
  }
}

export default ADKApiService;