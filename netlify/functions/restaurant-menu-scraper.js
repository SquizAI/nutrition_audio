exports.handler = async (event, context) => {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  // Handle preflight OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const { url } = JSON.parse(event.body);
    
    if (!url || !url.trim()) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'URL is required' }),
      };
    }

    // Validate URL format
    try {
      new URL(url);
    } catch (error) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid URL format' }),
      };
    }

    console.log('Scraping menu from URL:', url);

    // Simple web scraping for now - we'll enhance this with actual scraping
    // For demo purposes, return sample menu items
    const sampleMenuItems = [
      {
        name: "Grilled Chicken Caesar Salad",
        description: "Fresh romaine lettuce, grilled chicken breast, parmesan cheese, croutons, caesar dressing",
        price: "$14.99",
        calories: 420,
        protein: 35,
        carbs: 15,
        fat: 20,
        category: "Salads",
        ingredients: ["Chicken breast", "Romaine lettuce", "Parmesan cheese", "Croutons", "Caesar dressing"]
      },
      {
        name: "Classic Cheeseburger",
        description: "Beef patty, cheddar cheese, lettuce, tomato, onion, pickle, brioche bun",
        price: "$16.99",
        calories: 650,
        protein: 35,
        carbs: 45,
        fat: 35,
        category: "Burgers",
        ingredients: ["Beef patty", "Cheddar cheese", "Lettuce", "Tomato", "Onion", "Brioche bun"]
      },
      {
        name: "Margherita Pizza",
        description: "Fresh mozzarella, tomato sauce, basil, olive oil",
        price: "$18.99",
        calories: 520,
        protein: 22,
        carbs: 55,
        fat: 18,
        category: "Pizza",
        ingredients: ["Mozzarella", "Tomato sauce", "Basil", "Olive oil", "Pizza dough"]
      },
      {
        name: "Salmon Teriyaki Bowl",
        description: "Grilled salmon, steamed rice, broccoli, carrots, teriyaki sauce",
        price: "$22.99",
        calories: 480,
        protein: 40,
        carbs: 45,
        fat: 15,
        category: "Bowls",
        ingredients: ["Salmon", "Rice", "Broccoli", "Carrots", "Teriyaki sauce"]
      }
    ];

    const restaurantName = extractRestaurantName(url);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        restaurant_name: restaurantName,
        menu_items: sampleMenuItems,
        source_url: url,
        scraped_at: new Date().toISOString(),
        note: "This is a demo version. In production, this would scrape the actual website."
      }),
    };

  } catch (error) {
    console.error('Menu scraping error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Failed to scrape menu',
        details: error.message 
      }),
    };
  }
};

function extractRestaurantName(url) {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.replace('www.', '');
    return hostname.split('.')[0].charAt(0).toUpperCase() + hostname.split('.')[0].slice(1);
  } catch {
    return 'Restaurant Menu';
  }
} 