export async function handler(event, context) {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  // CORS headers for cross-origin requests
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  try {
    // Get OpenAI API key from environment variables
    const openaiApiKey = process.env.OPENAI_API_KEY;
    
    if (!openaiApiKey) {
      console.error('OPENAI_API_KEY not found in environment variables');
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ 
          error: 'OpenAI API key not configured. Please add OPENAI_API_KEY to Netlify environment variables.' 
        })
      };
    }

    // Log API key format for debugging (first and last 4 chars only)
    console.log('API Key format check:', openaiApiKey.substring(0, 8) + '...' + openaiApiKey.slice(-4));

    // Create ephemeral token for OpenAI Realtime API
    const requestBody = {
      model: 'gpt-4o-realtime-preview-2024-12-17',
      voice: 'verse'
    };

    console.log('Making request to OpenAI Realtime API:', requestBody);

    const response = await fetch('https://api.openai.com/v1/realtime/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    console.log('OpenAI Response Status:', response.status);
    console.log('OpenAI Response Headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error details:', {
        status: response.status,
        statusText: response.statusText,
        errorBody: errorText,
        url: response.url
      });

      // Parse error if it's JSON
      let errorDetails;
      try {
        errorDetails = JSON.parse(errorText);
      } catch {
        errorDetails = errorText;
      }

      return {
        statusCode: response.status,
        headers,
        body: JSON.stringify({ 
          error: `OpenAI API error: ${response.status} ${response.statusText}`,
          details: errorDetails,
          endpoint: 'https://api.openai.com/v1/realtime/sessions',
          debug: {
            apiKeyFormat: openaiApiKey.substring(0, 8) + '...' + openaiApiKey.slice(-4),
            requestModel: 'gpt-4o-realtime-preview-2024-12-17'
          }
        })
      };
    }

    const sessionData = await response.json();
    console.log('Session created successfully');
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        client_secret: {
          value: sessionData.client_secret.value
        }
      })
    };

  } catch (error) {
    console.error('Session creation error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Failed to create session',
        details: error.message 
      })
    };
  }
} 