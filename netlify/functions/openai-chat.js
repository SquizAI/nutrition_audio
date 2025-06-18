exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const { messages, functions, function_call } = JSON.parse(event.body);
    const openaiApiKey = process.env.OPENAI_API_KEY;
    
    if (!openaiApiKey) {
      return { statusCode: 500, headers, body: JSON.stringify({ error: 'OpenAI API key not configured' }) };
    }

    const requestBody = {
      model: 'gpt-4o-mini',
      messages,
      max_tokens: 1000,
      temperature: 0.7,
    };

    if (functions && functions.length > 0) {
      requestBody.functions = functions;
      if (function_call) requestBody.function_call = function_call;
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenAI API error:', response.status, errorData);
      return { statusCode: response.status, headers, body: JSON.stringify({ error: `OpenAI API error: ${response.status}`, details: errorData }) };
    }

    const data = await response.json();
    return { statusCode: 200, headers, body: JSON.stringify(data) };
  } catch (error) {
    console.error('Function error:', error);
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Internal server error', details: error.message }) };
  }
};
