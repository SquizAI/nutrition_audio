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
    const { messages, temperature = 0.7, max_tokens = 1000 } = JSON.parse(event.body);

    if (!messages || !Array.isArray(messages)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Messages array is required' }),
      };
    }

    const latestMessage = messages[messages.length - 1];
    const urlsInMessage = extractUrlsFromMessage(latestMessage.content);
    
    let enhancedMessages = [...messages];
    
    if (urlsInMessage.length > 0) {
      console.log('Found URLs in message:', urlsInMessage);
      
      for (const url of urlsInMessage) {
        try {
          const menuData = await fetchMenuFromUrl(url);
          
          if (menuData && menuData.menu_items && menuData.menu_items.length > 0) {
            const menuContext = formatMenuContext(menuData);
            enhancedMessages.push({
              role: 'system',
              content: `The user shared a restaurant URL. Here's the menu information I found:\n\n${menuContext}\n\nUse this information to help answer questions about the restaurant's menu, nutrition facts, or recommendations. Be helpful and specific about the menu items available.`
            });
          }
        } catch (error) {
          console.log('Error fetching menu for URL:', url, error.message);
          enhancedMessages.push({
            role: 'system',
            content: `The user shared a URL (${url}) but I wasn't able to access the menu information. I can still help with general nutrition advice and questions.`
          });
        }
      }
    }

    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `You are JME (Just Made Easy), an expert AI nutrition assistant. You help users with:

- Personalized nutrition advice and meal planning
- Understanding nutrition labels and food choices
- Restaurant menu analysis and healthy recommendations
- Calorie and macro tracking guidance
- Dietary restrictions and preferences
- Food preparation tips and recipes

When users share restaurant URLs or ask about specific menus, provide detailed analysis of:
- Healthiest options available
- Calorie and macro breakdowns
- Ingredient analysis
- Portion size recommendations
- Substitutions for dietary needs

Be friendly, knowledgeable, and practical. Use emojis occasionally to make responses engaging. Always prioritize health and balanced nutrition while being realistic about dining preferences.`
          },
          ...enhancedMessages
        ],
        temperature,
        max_tokens,
        stream: false
      }),
    });

    if (!openaiResponse.ok) {
      const errorData = await openaiResponse.text();
      console.error('OpenAI API error:', openaiResponse.status, errorData);
      
      return {
        statusCode: openaiResponse.status,
        headers,
        body: JSON.stringify({ 
          error: `OpenAI API error: ${openaiResponse.status}`,
          details: errorData 
        }),
      };
    }

    const data = await openaiResponse.json();
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: data.choices[0]?.message?.content || 'No response generated',
        usage: data.usage,
        urls_processed: urlsInMessage.length > 0 ? urlsInMessage : undefined
      }),
    };

  } catch (error) {
    console.error('Chat error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Failed to process chat request',
        details: error.message 
      }),
    };
  }
};

function extractUrlsFromMessage(content) {
  if (!content || typeof content !== 'string') return [];
  
  const urlRegex = /https?:\/\/[^\s<>"{}|\\^`[\]]+/gi;
  const urls = content.match(urlRegex) || [];
  
  const restaurantUrls = urls.filter(url => {
    const lowerUrl = url.toLowerCase();
    return (
      lowerUrl.includes('menu') ||
      lowerUrl.includes('restaurant') ||
      lowerUrl.includes('yelp.com') ||
      lowerUrl.includes('doordash.com') ||
      lowerUrl.includes('ubereats.com') ||
      lowerUrl.includes('grubhub.com') ||
      lowerUrl.includes('seamless.com') ||
      lowerUrl.includes('zomato.com') ||
      lowerUrl.includes('opentable.com') ||
      lowerUrl.includes('food') ||
      lowerUrl.includes('dining') ||
      lowerUrl.includes('cafe') ||
      lowerUrl.includes('pizza') ||
      lowerUrl.includes('burger') ||
      lowerUrl.includes('sushi') ||
      lowerUrl.includes('thai') ||
      lowerUrl.includes('mexican') ||
      lowerUrl.includes('italian') ||
      lowerUrl.includes('chinese') ||
      lowerUrl.includes('indian')
    );
  });
  
  return restaurantUrls.length > 0 ? restaurantUrls : urls.slice(0, 2);
}

async function fetchMenuFromUrl(url) {
  try {
    const response = await fetch(`${process.env.URL || 'https://curious-frangollo-3a0cda.netlify.app'}/api/restaurant-menu`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url }),
    });

    if (response.ok) {
      const data = await response.json();
      return data.success ? data : null;
    }
  } catch (error) {
    console.log('Failed to fetch menu from URL:', error.message);
  }
  
  return null;
}

function formatMenuContext(menuData) {
  const { restaurant_name, menu_items, extraction_method } = menuData;
  
  let context = `Restaurant: ${restaurant_name}\n`;
  context += `Menu extracted using: ${extraction_method}\n`;
  context += `Available Menu Items (${menu_items.length} items):\n\n`;
  
  menu_items.forEach((item, index) => {
    context += `${index + 1}. ${item.name}\n`;
    if (item.description) context += `   Description: ${item.description}\n`;
    if (item.price) context += `   Price: ${item.price}\n`;
    context += `   Nutrition: ${item.calories} cal, ${item.protein}g protein, ${item.carbs}g carbs, ${item.fat}g fat\n`;
    if (item.category) context += `   Category: ${item.category}\n`;
    if (item.ingredients && item.ingredients.length > 0) {
      context += `   Ingredients: ${item.ingredients.join(', ')}\n`;
    }
    context += '\n';
  });
  
  return context;
}
