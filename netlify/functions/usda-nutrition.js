exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    const usdaApiKey = process.env.USDA_API_KEY;
    if (!usdaApiKey) {
      return { statusCode: 500, headers, body: JSON.stringify({ error: 'USDA API key not configured' }) };
    }

    // Handle GET request for food search
    if (event.httpMethod === 'GET') {
      const { query, pageSize = 25 } = event.queryStringParameters || {};
      
      if (!query) {
        return { statusCode: 400, headers, body: JSON.stringify({ error: 'Query parameter is required' }) };
      }

      const searchUrl = `https://api.nal.usda.gov/fdc/v1/foods/search?api_key=${usdaApiKey}&query=${encodeURIComponent(query)}&pageSize=${pageSize}&dataType=Foundation,SR%20Legacy`;
      
      const response = await fetch(searchUrl);
      
      if (!response.ok) {
        const errorData = await response.text();
        console.error('USDA API search error:', response.status, errorData);
        return { statusCode: response.status, headers, body: JSON.stringify({ error: `USDA API error: ${response.status}`, details: errorData }) };
      }

      const data = await response.json();
      return { statusCode: 200, headers, body: JSON.stringify(data) };
    }

    // Handle POST request for detailed food info
    if (event.httpMethod === 'POST') {
      const { fdcIds } = JSON.parse(event.body);
      
      if (!fdcIds || !Array.isArray(fdcIds)) {
        return { statusCode: 400, headers, body: JSON.stringify({ error: 'fdcIds array is required' }) };
      }

      const detailUrl = `https://api.nal.usda.gov/fdc/v1/foods?api_key=${usdaApiKey}&fdcIds=${fdcIds.join(',')}&nutrients=203,204,205,208,269,291,301,303,304,305,306,307,309,312,315,317,318,320,323,324,325,326,328,334,337,401,404,405,406,410,415,418,421,430,431,432,435,436,578,601,606,645,646`;
      
      const response = await fetch(detailUrl);
      
      if (!response.ok) {
        const errorData = await response.text();
        console.error('USDA API detail error:', response.status, errorData);
        return { statusCode: response.status, headers, body: JSON.stringify({ error: `USDA API error: ${response.status}`, details: errorData }) };
      }

      const data = await response.json();
      return { statusCode: 200, headers, body: JSON.stringify(data) };
    }

    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };

  } catch (error) {
    console.error('Function error:', error);
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Internal server error', details: error.message }) };
  }
};
