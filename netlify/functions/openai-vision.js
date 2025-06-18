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
    const { imageData, prompt = "Analyze this food image and provide detailed nutritional information. Identify all foods, estimate portions, and calculate approximate calories, protein, carbs, and fat." } = JSON.parse(event.body);
    
    const openaiApiKey = process.env.OPENAI_API_KEY;
    if (!openaiApiKey) {
      return { statusCode: 500, headers, body: JSON.stringify({ error: 'OpenAI API key not configured' }) };
    }

    if (!imageData) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Image data is required' }) };
    }

    const requestBody = {
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            {
              type: "image_url",
              image_url: {
                url: imageData
              }
            }
          ]
        }
      ],
      max_tokens: 1000,
      temperature: 0.7,
    };

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
      console.error('OpenAI Vision API error:', response.status, errorData);
      return { statusCode: response.status, headers, body: JSON.stringify({ error: `OpenAI Vision API error: ${response.status}`, details: errorData }) };
    }

    const data = await response.json();
    return { statusCode: 200, headers, body: JSON.stringify(data) };
  } catch (error) {
    console.error('Function error:', error);
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Internal server error', details: error.message }) };
  }
};
