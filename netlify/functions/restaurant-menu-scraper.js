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

    // First, try to scrape the webpage content and images
    let menuItems = [];
    let restaurantName = extractRestaurantName(url);
    let extractionMethod = 'demo';

    try {
      // Step 1: Scrape the webpage content
      const scrapeResponse = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });

      if (scrapeResponse.ok) {
        const htmlContent = await scrapeResponse.text();
        
        // Step 2: Extract images that might contain menu information
        const imageUrls = extractImageUrls(htmlContent, url);
        console.log('Found images:', imageUrls.length);

        // Step 3: Use OpenAI Vision API to analyze menu images
        if (imageUrls.length > 0) {
          const visionResults = await analyzeMenuImages(imageUrls);
          if (visionResults && visionResults.length > 0) {
            menuItems = visionResults;
            extractionMethod = 'vision';
          }
        }

        // Step 4: Extract text-based menu items if no images found
        if (menuItems.length === 0) {
          const textMenuItems = extractMenuFromHTML(htmlContent);
          if (textMenuItems.length > 0) {
            menuItems = textMenuItems;
            extractionMethod = 'text';
          }
        }

        // Update restaurant name from page content
        const extractedName = extractRestaurantNameFromHTML(htmlContent);
        if (extractedName) {
          restaurantName = extractedName;
        }
      }
    } catch (error) {
      console.log('Error scraping webpage:', error.message);
    }

    // Fallback to demo data if no extraction worked
    if (menuItems.length === 0) {
      menuItems = getDemoMenuItems();
      extractionMethod = 'demo';
    }

    // Ensure all menu items have required fields and reasonable nutrition estimates
    const processedItems = menuItems.map(item => ({
      name: item.name || 'Menu Item',
      description: item.description || '',
      price: item.price || '',
      calories: item.calories || estimateCalories(item.name, item.description),
      protein: item.protein || estimateProtein(item.name, item.description),
      carbs: item.carbs || estimateCarbs(item.name, item.description),
      fat: item.fat || estimateFat(item.name, item.description),
      category: item.category || categorizeMenuItem(item.name, item.description),
      ingredients: item.ingredients || extractIngredients(item.name, item.description),
      image_url: item.image_url || null
    }));

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        restaurant_name: restaurantName,
        menu_items: processedItems.slice(0, 15), // Limit to 15 items
        source_url: url,
        extraction_method: extractionMethod,
        scraped_at: new Date().toISOString(),
        note: extractionMethod === 'demo' ? 'Demo data - in production this would scrape the actual website and analyze menu images.' : `Menu extracted using ${extractionMethod} analysis.`
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

// Enhanced image analysis using OpenAI Vision API
async function analyzeMenuImages(imageUrls) {
  if (!process.env.OPENAI_API_KEY) {
    console.log('No OpenAI API key available for image analysis');
    return [];
  }

  try {
    // Analyze up to 3 images to avoid token limits
    const imagesToAnalyze = imageUrls.slice(0, 3);
    const menuItems = [];

    for (const imageUrl of imagesToAnalyze) {
      console.log('Analyzing image:', imageUrl);
      
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: [
            {
              role: 'user',
              content: [
                {
                  type: 'text',
                  text: 'Analyze this menu image and extract all visible menu items. For each item, provide: name, description, price (if visible), and estimate calories, protein, carbs, and fat. Return the data as a JSON array of objects with these exact fields: name, description, price, calories, protein, carbs, fat, category. Only return the JSON array, no other text.'
                },
                {
                  type: 'image_url',
                  image_url: {
                    url: imageUrl,
                    detail: 'high'
                  }
                }
              ]
            }
          ],
          max_tokens: 1500
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const content = data.choices[0]?.message?.content;
        
        if (content) {
          try {
            // Try to parse the JSON response
            const extractedItems = JSON.parse(content);
            if (Array.isArray(extractedItems)) {
              menuItems.push(...extractedItems);
            }
          } catch (parseError) {
            console.log('Failed to parse Vision API response as JSON:', parseError);
            // Try to extract menu items from text response
            const textItems = parseMenuItemsFromText(content);
            menuItems.push(...textItems);
          }
        }
      }
    }

    return menuItems;
  } catch (error) {
    console.error('Error analyzing menu images:', error);
    return [];
  }
}

// Extract image URLs from HTML content
function extractImageUrls(htmlContent, baseUrl) {
  const imageUrls = [];
  const imgRegex = /<img[^>]+src=['"](.*?)['"]/gi;
  let match;

  while ((match = imgRegex.exec(htmlContent)) !== null) {
    let imageUrl = match[1];
    
    // Convert relative URLs to absolute
    if (imageUrl.startsWith('/')) {
      const urlObj = new URL(baseUrl);
      imageUrl = urlObj.origin + imageUrl;
    } else if (imageUrl.startsWith('//')) {
      imageUrl = 'https:' + imageUrl;
    } else if (!imageUrl.startsWith('http')) {
      continue; // Skip invalid URLs
    }

    // Filter for likely menu images based on alt text, class names, or file names
    const imgElement = match[0];
    if (isLikelyMenuImage(imgElement, imageUrl)) {
      imageUrls.push(imageUrl);
    }
  }

  // Remove duplicates and limit to reasonable number
  return [...new Set(imageUrls)].slice(0, 5);
}

// Check if an image is likely to contain menu information
function isLikelyMenuImage(imgElement, imageUrl) {
  const menuKeywords = ['menu', 'food', 'dish', 'meal', 'cuisine', 'plate', 'restaurant'];
  const excludeKeywords = ['logo', 'icon', 'avatar', 'profile', 'banner', 'ad'];
  
  const combined = (imgElement + ' ' + imageUrl).toLowerCase();
  
  // Check for menu-related keywords
  const hasMenuKeyword = menuKeywords.some(keyword => combined.includes(keyword));
  
  // Check for excluded keywords
  const hasExcludeKeyword = excludeKeywords.some(keyword => combined.includes(keyword));
  
  // For Yelp, look for photo gallery images
  if (imageUrl.includes('yelp') && (combined.includes('photo') || combined.includes('gallery'))) {
    return true;
  }
  
  return hasMenuKeyword && !hasExcludeKeyword;
}

// Extract menu items from HTML text content
function extractMenuFromHTML(htmlContent) {
  const menuItems = [];
  
  // Remove HTML tags and get text content
  const textContent = htmlContent.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ');
  
  // Look for patterns that indicate menu items
  const lines = textContent.split('\n');
  
  for (const line of lines) {
    const trimmedLine = line.trim();
    
    // Skip short lines
    if (trimmedLine.length < 10) continue;
    
    // Look for price patterns ($X.XX)
    const priceMatch = trimmedLine.match(/\$(\d+\.?\d*)/);
    
    // Look for calorie patterns
    const calorieMatch = trimmedLine.match(/(\d+)\s*cal/i);
    
    if (priceMatch || calorieMatch || isLikelyMenuItem(trimmedLine)) {
      const item = parseMenuItemFromText(trimmedLine);
      if (item.name) {
        menuItems.push(item);
      }
    }
  }
  
  return menuItems.slice(0, 10); // Limit results
}

// Check if a text line is likely a menu item
function isLikelyMenuItem(text) {
  const menuIndicators = [
    /\b(burger|pizza|salad|sandwich|pasta|chicken|beef|fish|soup|wrap|bowl)\b/i,
    /\b(grilled|fried|baked|roasted|fresh|organic|house|signature)\b/i,
    /\$\d+/,
    /\d+\s*cal/i
  ];
  
  return menuIndicators.some(pattern => pattern.test(text));
}

// Parse a menu item from text
function parseMenuItemFromText(text) {
  const priceMatch = text.match(/\$(\d+\.?\d*)/);
  const calorieMatch = text.match(/(\d+)\s*cal/i);
  
  // Extract name (usually the first part before description)
  let name = text.split(/[-–—]|\.{2,}/)[0].trim();
  name = name.replace(/\$\d+\.?\d*/, '').trim(); // Remove price from name
  
  // Extract description (part after separator)
  const parts = text.split(/[-–—]|\.{2,}/);
  const description = parts.length > 1 ? parts.slice(1).join(' ').trim() : '';
  
  return {
    name: name || 'Menu Item',
    description: description,
    price: priceMatch ? priceMatch[0] : '',
    calories: calorieMatch ? parseInt(calorieMatch[1]) : 0,
    protein: 0,
    carbs: 0,
    fat: 0
  };
}

// Parse menu items from AI text response
function parseMenuItemsFromText(text) {
  const items = [];
  const lines = text.split('\n');
  
  for (const line of lines) {
    if (line.trim() && line.includes(':')) {
      const item = parseMenuItemFromText(line);
      if (item.name) {
        items.push(item);
      }
    }
  }
  
  return items;
}

// Extract restaurant name from HTML content
function extractRestaurantNameFromHTML(htmlContent) {
  // Look for title tag
  const titleMatch = htmlContent.match(/<title[^>]*>(.*?)<\/title>/i);
  if (titleMatch) {
    let title = titleMatch[1].replace(/&[^;]+;/g, '').trim();
    // Clean up common title suffixes
    title = title.replace(/\s*[-|]\s*(Menu|Restaurant|Yelp|Order|Delivery).*$/i, '');
    if (title.length > 0 && title.length < 50) {
      return title;
    }
  }
  
  // Look for h1 tags
  const h1Match = htmlContent.match(/<h1[^>]*>(.*?)<\/h1>/i);
  if (h1Match) {
    let h1Text = h1Match[1].replace(/<[^>]*>/g, '').trim();
    if (h1Text.length > 0 && h1Text.length < 50) {
      return h1Text;
    }
  }
  
  return null;
}

// Demo menu items for fallback
function getDemoMenuItems() {
  return [
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
}

// Helper functions for nutrition estimation (same as before)
function estimateCalories(name, description) {
  const text = (name + ' ' + description).toLowerCase();
  
  if (text.includes('salad') && !text.includes('chicken') && !text.includes('salmon')) return 250;
  if (text.includes('burger') || text.includes('sandwich')) return 550;
  if (text.includes('pizza')) return 400;
  if (text.includes('pasta')) return 450;
  if (text.includes('steak') || text.includes('beef')) return 600;
  if (text.includes('chicken') && text.includes('grilled')) return 400;
  if (text.includes('salmon') || text.includes('fish')) return 450;
  if (text.includes('soup')) return 200;
  if (text.includes('wrap')) return 350;
  
  return 350; // Default estimate
}

function estimateProtein(name, description) {
  const text = (name + ' ' + description).toLowerCase();
  
  if (text.includes('steak') || text.includes('beef')) return 45;
  if (text.includes('chicken')) return 35;
  if (text.includes('salmon') || text.includes('fish')) return 40;
  if (text.includes('turkey')) return 30;
  if (text.includes('egg')) return 20;
  if (text.includes('tofu') || text.includes('tempeh')) return 15;
  if (text.includes('beans') || text.includes('lentils')) return 12;
  
  return 15; // Default estimate
}

function estimateCarbs(name, description) {
  const text = (name + ' ' + description).toLowerCase();
  
  if (text.includes('pasta') || text.includes('noodle')) return 55;
  if (text.includes('rice')) return 45;
  if (text.includes('burger') || text.includes('sandwich')) return 35;
  if (text.includes('pizza')) return 40;
  if (text.includes('salad') && !text.includes('pasta')) return 15;
  if (text.includes('wrap')) return 30;
  
  return 25; // Default estimate
}

function estimateFat(name, description) {
  const text = (name + ' ' + description).toLowerCase();
  
  if (text.includes('fried') || text.includes('crispy')) return 25;
  if (text.includes('burger')) return 30;
  if (text.includes('pizza')) return 18;
  if (text.includes('avocado')) return 20;
  if (text.includes('salmon') || text.includes('fish')) return 22;
  if (text.includes('salad') && text.includes('dressing')) return 15;
  if (text.includes('grilled') && text.includes('chicken')) return 12;
  
  return 12; // Default estimate
}

function categorizeMenuItem(name, description) {
  const text = (name + ' ' + description).toLowerCase();
  
  if (text.includes('salad')) return 'Salads';
  if (text.includes('burger') || text.includes('sandwich')) return 'Sandwiches & Burgers';
  if (text.includes('pizza')) return 'Pizza';
  if (text.includes('pasta') || text.includes('noodle')) return 'Pasta & Noodles';
  if (text.includes('steak') || text.includes('beef') || text.includes('chicken') || text.includes('salmon')) return 'Main Dishes';
  if (text.includes('soup')) return 'Soups';
  if (text.includes('wrap')) return 'Wraps';
  if (text.includes('appetizer') || text.includes('starter')) return 'Appetizers';
  if (text.includes('dessert') || text.includes('cake') || text.includes('ice cream')) return 'Desserts';
  
  return 'Entrees';
}

function extractIngredients(name, description) {
  const text = (name + ' ' + description).toLowerCase();
  const ingredients = [];
  
  const commonIngredients = [
    'chicken', 'beef', 'salmon', 'tuna', 'turkey', 'bacon', 'ham',
    'lettuce', 'tomato', 'onion', 'mushroom', 'pepper', 'cheese', 'avocado',
    'rice', 'pasta', 'bread', 'potato', 'quinoa',
    'olive oil', 'dressing', 'sauce', 'herbs', 'spices'
  ];
  
  commonIngredients.forEach(ingredient => {
    if (text.includes(ingredient)) {
      ingredients.push(ingredient.charAt(0).toUpperCase() + ingredient.slice(1));
    }
  });
  
  return ingredients.length > 0 ? ingredients : [name];
}

function extractRestaurantName(url) {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.replace('www.', '');
    return hostname.split('.')[0].charAt(0).toUpperCase() + hostname.split('.')[0].slice(1);
  } catch {
    return 'Restaurant Menu';
  }
} 