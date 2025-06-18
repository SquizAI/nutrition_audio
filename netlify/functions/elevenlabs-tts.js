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
    const { text, voice_id = 'K4mIm9HZLpIcJUypZOl1' } = JSON.parse(event.body);
    
    const elevenLabsApiKey = process.env.ELEVENLABS_API_KEY;
    if (!elevenLabsApiKey) {
      return { statusCode: 500, headers, body: JSON.stringify({ error: 'ElevenLabs API key not configured' }) };
    }

    if (!text || text.trim().length === 0) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Text parameter is required' }) };
    }

    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voice_id}`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': elevenLabsApiKey,
      },
      body: JSON.stringify({
        text: text,
        model_id: 'eleven_monolingual_v1',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
          style: 0,
          use_speaker_boost: true,
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('ElevenLabs API error:', response.status, errorData);
      return { statusCode: response.status, headers, body: JSON.stringify({ error: `ElevenLabs API error: ${response.status}`, details: errorData }) };
    }

    const audioBuffer = await response.arrayBuffer();
    const audioBase64 = Buffer.from(audioBuffer).toString('base64');
    
    return {
      statusCode: 200,
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ audio: audioBase64, contentType: 'audio/mpeg' }),
    };
  } catch (error) {
    console.error('Function error:', error);
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Internal server error', details: error.message }) };
  }
};
