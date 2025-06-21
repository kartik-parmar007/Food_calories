import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = 'AIzaSyDhtkEFNSVCqZk8NGHjLQEX02PnRTSZUaY';
const genAI = new GoogleGenerativeAI(API_KEY);

export interface CalorieResult {
  foodName: string;
  calories: string;
  servingSize: string;
  nutrients?: {
    protein?: string;
    carbs?: string;
    fat?: string;
    fiber?: string;
  };
  confidence: number;
}

export class GeminiService {
  private model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

  async analyzeFoodImage(imageBase64: string): Promise<CalorieResult> {
    try {
      const prompt = `
        Analyze this food image and provide detailed nutritional information.
        Please respond with a JSON object containing:
        {
          "foodName": "name of the food",
          "calories": "estimated calories per serving (e.g., '320–350 kcal')",
          "servingSize": "typical serving size description",
          "nutrients": {
            "protein": "grams of protein (e.g., '3–5 g')",
            "carbs": "grams of carbohydrates (e.g., '43–49 g')",
            "fat": "grams of fat (e.g., '15–17 g')",
            "fiber": "grams of fiber (e.g., '3–4 g')"
          },
          "confidence": confidence level (0-1)
        }
        
        IMPORTANT: Always provide ranges for nutritional values (e.g., '320–350 kcal', '3–5 g', '43–49 g', '15–17 g', '3–4 g').
        If you cannot identify the food clearly, set confidence to 0 and provide best estimate with ranges.
        Be as accurate as possible with nutritional information ranges.
        Respond ONLY with the JSON object, no additional text.
      `;

      const imagePart = {
        inlineData: {
          data: imageBase64,
          mimeType: 'image/jpeg'
        }
      };

      const result = await this.model.generateContent([prompt, imagePart]);
      const response = await result.response;
      const text = response.text();
      
      console.log('📥 Received image analysis response:', text);
      
      // Try multiple JSON parsing strategies
      let parsed: any = null;
      
      // Strategy 1: Look for JSON object in the response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          parsed = JSON.parse(jsonMatch[0]);
          console.log('✅ Image analysis parsed result (strategy 1):', parsed);
        } catch (parseError) {
          console.log('❌ Strategy 1 parsing failed:', parseError);
        }
      }
      
      // Strategy 2: Try to parse the entire response as JSON
      if (!parsed) {
        try {
          parsed = JSON.parse(text.trim());
          console.log('✅ Image analysis parsed result (strategy 2):', parsed);
        } catch (parseError) {
          console.log('❌ Strategy 2 parsing failed:', parseError);
        }
      }
      
      // Strategy 3: Try to extract JSON from markdown code blocks
      if (!parsed) {
        const codeBlockMatch = text.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
        if (codeBlockMatch) {
          try {
            parsed = JSON.parse(codeBlockMatch[1]);
            console.log('✅ Image analysis parsed result (strategy 3):', parsed);
          } catch (parseError) {
            console.log('❌ Strategy 3 parsing failed:', parseError);
          }
        }
      }
      
      if (parsed && typeof parsed === 'object') {
        // Validate and sanitize the parsed result
        const sanitizedResult: CalorieResult = {
          foodName: parsed.foodName || 'Unknown Food',
          calories: parsed.calories || 'Unknown',
          servingSize: parsed.servingSize || '1 serving',
          confidence: typeof parsed.confidence === 'number' ? parsed.confidence : 0.5,
          nutrients: {}
        };
        
        // Add nutrients if they exist
        if (parsed.nutrients && typeof parsed.nutrients === 'object') {
          if (parsed.nutrients.protein) sanitizedResult.nutrients!.protein = parsed.nutrients.protein;
          if (parsed.nutrients.carbs) sanitizedResult.nutrients!.carbs = parsed.nutrients.carbs;
          if (parsed.nutrients.fat) sanitizedResult.nutrients!.fat = parsed.nutrients.fat;
          if (parsed.nutrients.fiber) sanitizedResult.nutrients!.fiber = parsed.nutrients.fiber;
        }
        
        console.log('✅ Final sanitized image result:', sanitizedResult);
        return sanitizedResult;
      } else {
        console.error('❌ No valid JSON found in image analysis response');
        console.error('❌ Raw response:', text);
        // Fallback if JSON parsing fails
        return {
          foodName: 'Unknown Food',
          calories: 'Unknown',
          servingSize: 'Unknown',
          confidence: 0
        };
      }
    } catch (error) {
      console.error('Error analyzing image:', error);
      throw new Error('Failed to analyze food image');
    }
  }

  async getNutritionalInfo(foodName: string): Promise<CalorieResult> {
    try {
      console.log('🔍 Searching for:', foodName);

      const locationDetectionPrompt = `
        Is "${foodName}" a geographical location (e.g., city, state, country, continent)?
        Respond with a JSON object:
        {
          "is_location": boolean,
          "location_name": "name of the location if true, otherwise null"
        }
        Respond ONLY with the JSON object.
      `;

      const locationResult = await this.model.generateContent(locationDetectionPrompt);
      const locationResponse = await locationResult.response;
      const locationText = locationResponse.text();
      const locationJsonMatch = locationText.match(/\{[\s\S]*\}/);

      let isLocation = false;
      let famousDish = foodName;

      if (locationJsonMatch) {
        try {
          const parsedLocation = JSON.parse(locationJsonMatch[0]);
          if (parsedLocation.is_location) {
            isLocation = true;
            console.log(`✅ Detected location: ${parsedLocation.location_name}`);
            famousDish = await this.getFamousDishForLocation(parsedLocation.location_name);
            console.log(`🍲 Famous dish for ${parsedLocation.location_name}: ${famousDish}`);
          }
        } catch (e) {
          console.log('Could not parse location JSON, proceeding with food search.');
        }
      }

      const prompt = `
        Provide nutritional information for "${famousDish}".
        Respond with a JSON object:
        {
          "foodName": "${famousDish}",
          "calories": "estimated calories per serving (e.g., '320–350 kcal')",
          "servingSize": "typical serving size",
          "nutrients": {
            "protein": "grams of protein (e.g., '3–5 g')",
            "carbs": "grams of carbohydrates (e.g., '43–49 g')",
            "fat": "grams of fat (e.g., '15–17 g')",
            "fiber": "grams of fiber (e.g., '3–4 g')"
          },
          "confidence": 0.9
        }
        
        IMPORTANT: Always provide ranges for nutritional values (e.g., '320–350 kcal', '3–5 g', '43–49 g', '15–17 g', '3–4 g').
        Use realistic ranges based on typical variations in food products.
        Respond ONLY with the JSON object, no additional text.
      `;

      console.log('📤 Sending request to Gemini API...');
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      console.log('📥 Received response:', text);
      
      // Try multiple JSON parsing strategies
      let parsed: any = null;
      
      // Strategy 1: Look for JSON object in the response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          parsed = JSON.parse(jsonMatch[0]);
          console.log('✅ Parsed result (strategy 1):', parsed);
        } catch (parseError) {
          console.log('❌ Strategy 1 parsing failed:', parseError);
        }
      }
      
      // Strategy 2: Try to parse the entire response as JSON
      if (!parsed) {
        try {
          parsed = JSON.parse(text.trim());
          console.log('✅ Parsed result (strategy 2):', parsed);
        } catch (parseError) {
          console.log('❌ Strategy 2 parsing failed:', parseError);
        }
      }
      
      // Strategy 3: Try to extract JSON from markdown code blocks
      if (!parsed) {
        const codeBlockMatch = text.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
        if (codeBlockMatch) {
          try {
            parsed = JSON.parse(codeBlockMatch[1]);
            console.log('✅ Parsed result (strategy 3):', parsed);
          } catch (parseError) {
            console.log('❌ Strategy 3 parsing failed:', parseError);
          }
        }
      }
      
      if (parsed && typeof parsed === 'object') {
        // Validate and sanitize the parsed result
        const sanitizedResult: CalorieResult = {
          foodName: parsed.foodName || famousDish,
          calories: parsed.calories || 'Unknown',
          servingSize: parsed.servingSize || '1 serving',
          confidence: typeof parsed.confidence === 'number' ? parsed.confidence : 0.9,
          nutrients: {}
        };
        
        // Add nutrients if they exist
        if (parsed.nutrients && typeof parsed.nutrients === 'object') {
          if (parsed.nutrients.protein) sanitizedResult.nutrients!.protein = parsed.nutrients.protein;
          if (parsed.nutrients.carbs) sanitizedResult.nutrients!.carbs = parsed.nutrients.carbs;
          if (parsed.nutrients.fat) sanitizedResult.nutrients!.fat = parsed.nutrients.fat;
          if (parsed.nutrients.fiber) sanitizedResult.nutrients!.fiber = parsed.nutrients.fiber;
        }
        
        console.log('✅ Final sanitized result:', sanitizedResult);
        return sanitizedResult;
      } else {
        console.error('❌ No valid JSON found in response');
        console.error('❌ Raw response:', text);
        throw new Error('Failed to parse nutritional information. The AI response was not in the expected format.');
      }
    } catch (error) {
      console.error('❌ Error getting nutritional info:', error);
      
      // Provide more specific error messages
      if (error instanceof Error) {
        if (error.message.includes('API_KEY')) {
          throw new Error('API key is invalid or missing');
        } else if (error.message.includes('quota')) {
          throw new Error('API quota exceeded. Please try again later.');
        } else if (error.message.includes('network')) {
          throw new Error('Network error. Please check your internet connection.');
        } else {
          throw new Error(`Failed to get nutritional information: ${error.message}`);
        }
      } else {
        throw new Error('Failed to get nutritional information. Please try again.');
      }
    }
  }

  async getFamousDishForLocation(location: string): Promise<string> {
    try {
      const prompt = `
        What is a single, very famous, and representative food dish from "${location}"?
        Provide just the name of the dish. For example, if the location is "Japan", you could respond with "Sushi".
        If the location is "Gujarat, India", a good response would be "Dhokla".
        Respond ONLY with the name of the dish, no additional text.
      `;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Clean up the response to get just the dish name
      return text.trim().replace(/(\r\n|\n|\r)/gm, "");
    } catch (error) {
      console.error(`Could not find a famous dish for ${location}`, error);
      // Fallback to a generic query if the location-based search fails
      return `food from ${location}`;
    }
  }

  async getNutritionalInfoFromUrl(productUrl: string): Promise<CalorieResult> {
    try {
      console.log('🔍 Analyzing product URL:', productUrl);
      
      // Extract product information from URL
      const urlInfo = this.extractProductInfoFromUrl(productUrl);
      console.log('📋 Extracted product info:', urlInfo);
      
      if (!urlInfo.productName || urlInfo.productName === 'Unknown Product') {
        throw new Error('Could not extract product name from URL. Please try a different URL or use text search instead.');
      }
      
      // Use the extracted product name to get nutritional information
      const prompt = `
        Provide nutritional information for "${urlInfo.productName}"${urlInfo.brand ? ` (brand: ${urlInfo.brand})` : ''}.
        Respond with a JSON object:
        {
          "foodName": "${urlInfo.productName}",
          "calories": "estimated calories per serving (e.g., '320–350 kcal')",
          "servingSize": "typical serving size",
          "nutrients": {
            "protein": "grams of protein (e.g., '3–5 g')",
            "carbs": "grams of carbohydrates (e.g., '43–49 g')",
            "fat": "grams of fat (e.g., '15–17 g')",
            "fiber": "grams of fiber (e.g., '3–4 g')"
          },
          "confidence": 0.8
        }
        
        IMPORTANT: Always provide ranges for nutritional values (e.g., '320–350 kcal', '3–5 g', '43–49 g', '15–17 g', '3–4 g').
        Use realistic ranges based on typical variations in food products.
        If this is a specific brand product, provide more accurate ranges.
        Respond ONLY with the JSON object, no additional text.
      `;

      console.log('📤 Sending product analysis request to Gemini API...');
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      console.log('📥 Received product analysis response:', text);
      
      // Try multiple JSON parsing strategies
      let parsed: any = null;
      
      // Strategy 1: Look for JSON object in the response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          parsed = JSON.parse(jsonMatch[0]);
          console.log('✅ Product analysis parsed result (strategy 1):', parsed);
        } catch (parseError) {
          console.log('❌ Strategy 1 parsing failed:', parseError);
        }
      }
      
      // Strategy 2: Try to parse the entire response as JSON
      if (!parsed) {
        try {
          parsed = JSON.parse(text.trim());
          console.log('✅ Product analysis parsed result (strategy 2):', parsed);
        } catch (parseError) {
          console.log('❌ Strategy 2 parsing failed:', parseError);
        }
      }
      
      // Strategy 3: Try to extract JSON from markdown code blocks
      if (!parsed) {
        const codeBlockMatch = text.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
        if (codeBlockMatch) {
          try {
            parsed = JSON.parse(codeBlockMatch[1]);
            console.log('✅ Product analysis parsed result (strategy 3):', parsed);
          } catch (parseError) {
            console.log('❌ Strategy 3 parsing failed:', parseError);
          }
        }
      }
      
      if (parsed && typeof parsed === 'object') {
        // Validate and sanitize the parsed result
        const sanitizedResult: CalorieResult = {
          foodName: parsed.foodName || urlInfo.productName,
          calories: parsed.calories || 'Unknown',
          servingSize: parsed.servingSize || '1 serving',
          confidence: typeof parsed.confidence === 'number' ? parsed.confidence : 0.8,
          nutrients: {}
        };
        
        // Add nutrients if they exist
        if (parsed.nutrients && typeof parsed.nutrients === 'object') {
          if (parsed.nutrients.protein) sanitizedResult.nutrients!.protein = parsed.nutrients.protein;
          if (parsed.nutrients.carbs) sanitizedResult.nutrients!.carbs = parsed.nutrients.carbs;
          if (parsed.nutrients.fat) sanitizedResult.nutrients!.fat = parsed.nutrients.fat;
          if (parsed.nutrients.fiber) sanitizedResult.nutrients!.fiber = parsed.nutrients.fiber;
        }
        
        console.log('✅ Final sanitized result:', sanitizedResult);
        return sanitizedResult;
      } else {
        console.error('❌ No valid JSON found in product analysis response');
        console.error('❌ Raw response:', text);
        throw new Error('Failed to parse product information. The AI response was not in the expected format.');
      }
    } catch (error) {
      console.error('❌ Error analyzing product URL:', error);
      
      // Provide more specific error messages
      if (error instanceof Error) {
        if (error.message.includes('API_KEY')) {
          throw new Error('API key is invalid or missing');
        } else if (error.message.includes('quota')) {
          throw new Error('API quota exceeded. Please try again later.');
        } else if (error.message.includes('network')) {
          throw new Error('Network error. Please check your internet connection.');
        } else if (error.message.includes('Could not extract product name')) {
          throw new Error(error.message);
        } else {
          throw new Error(`Failed to analyze product: ${error.message}`);
        }
      } else {
        throw new Error('Failed to analyze product. Please try again.');
      }
    }
  }

  private extractProductInfoFromUrl(url: string): { productName: string; brand?: string } {
    try {
      const urlObj = new URL(url);
      const pathname = urlObj.pathname.toLowerCase();
      const hostname = urlObj.hostname.toLowerCase();
      
      // Extract brand from hostname
      let brand: string | undefined;
      if (hostname.includes('amazon')) brand = 'Amazon';
      else if (hostname.includes('walmart')) brand = 'Walmart';
      else if (hostname.includes('target')) brand = 'Target';
      else if (hostname.includes('kroger')) brand = 'Kroger';
      else if (hostname.includes('safeway')) brand = 'Safeway';
      else if (hostname.includes('wholefoods')) brand = 'Whole Foods';
      else if (hostname.includes('traderjoes')) brand = 'Trader Joe\'s';
      else if (hostname.includes('costco')) brand = 'Costco';
      else if (hostname.includes('sprouts')) brand = 'Sprouts';
      
      // Extract product name from URL path - improved logic
      let productName = '';
      
      // Split path into segments and filter meaningful ones
      const pathSegments = pathname.split('/').filter(segment => 
        segment && 
        segment.length > 1 && 
        !['product', 'item', 'p', 'dp', 'gp', 'ip', 'search', 'category', 'department'].includes(segment)
      );
      
      if (pathSegments.length > 0) {
        // Try to find the most meaningful segment
        let bestSegment = '';
        
        for (const segment of pathSegments) {
          // Skip segments that are likely IDs or codes
          if (segment.length > 20 || /^[a-f0-9]{10,}$/i.test(segment)) continue;
          
          // Prefer segments with words (letters) rather than just numbers/symbols
          const wordCount = (segment.match(/[a-zA-Z]+/g) || []).length;
          if (wordCount > 0 && segment.length > bestSegment.length) {
            bestSegment = segment;
          }
        }
        
        if (bestSegment) {
          // Clean up the segment
          let cleanedSegment = bestSegment;
          
          // Remove file extensions
          cleanedSegment = cleanedSegment.replace(/\.(html|htm|php|asp|aspx|jsp)$/i, '');
          
          // Replace common separators with spaces
          cleanedSegment = cleanedSegment.replace(/[-_+]/g, ' ');
          
          // Remove common product ID patterns
          cleanedSegment = cleanedSegment.replace(/\b[A-Z0-9]{8,}\b/g, ''); // Remove long alphanumeric codes
          cleanedSegment = cleanedSegment.replace(/\b\d{4,}\b/g, ''); // Remove long numbers
          
          // Clean up extra spaces and capitalize
          productName = cleanedSegment
            .split(' ')
            .filter(word => word.length > 0)
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ')
            .trim();
        }
      }
      
      // If we still don't have a good product name, try URL parameters
      if (!productName || productName.length < 3) {
        const searchParams = urlObj.searchParams;
        
        // Try various parameter names that might contain product info
        const possibleParams = ['title', 'name', 'product', 'item', 'keyword', 'search'];
        for (const param of possibleParams) {
          const value = searchParams.get(param);
          if (value && value.length > 3) {
            productName = decodeURIComponent(value)
              .replace(/[-_+]/g, ' ')
              .split(' ')
              .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
              .join(' ')
              .trim();
            break;
          }
        }
      }
      
      // Special handling for Amazon URLs
      if (hostname.includes('amazon') && !productName) {
        // Amazon often has product names in the URL path
        const amazonMatch = pathname.match(/\/([^\/]+)(?:\/dp\/|\/gp\/product\/)/);
        if (amazonMatch && amazonMatch[1]) {
          productName = amazonMatch[1]
            .replace(/[-_+]/g, ' ')
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ')
            .trim();
        }
      }
      
      // Fallback: use a generic name if we still can't extract anything
      if (!productName || productName.length < 3) {
        productName = 'Product from ' + (brand || urlObj.hostname.replace('www.', ''));
      }
      
      console.log('🔍 Extracted from URL:', { productName, brand, originalUrl: url });
      return { productName, brand };
    } catch (error) {
      console.error('Error extracting product info from URL:', error);
      return { productName: 'Unknown Product' };
    }
  }
}

export const geminiService = new GeminiService(); 