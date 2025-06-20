import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = 'AIzaSyDhtkEFNSVCqZk8NGHjLQEX02PnRTSZUaY';
const genAI = new GoogleGenerativeAI(API_KEY);

export interface CalorieResult {
  foodName: string;
  calories: number;
  servingSize: string;
  nutrients?: {
    protein?: number;
    carbs?: number;
    fat?: number;
    fiber?: number;
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
          "calories": estimated calories per serving,
          "servingSize": "typical serving size description",
          "nutrients": {
            "protein": grams of protein,
            "carbs": grams of carbohydrates,
            "fat": grams of fat,
            "fiber": grams of fiber
          },
          "confidence": confidence level (0-1)
        }
        
        If you cannot identify the food clearly, set confidence to 0 and provide best estimate.
        Be as accurate as possible with nutritional information.
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
      
      // Try to parse JSON from response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return parsed as CalorieResult;
      } else {
        // Fallback if JSON parsing fails
        return {
          foodName: 'Unknown Food',
          calories: 0,
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
      const prompt = `
        Provide nutritional information for "${foodName}".
        Respond with a JSON object:
        {
          "foodName": "${foodName}",
          "calories": estimated calories per serving,
          "servingSize": "typical serving size",
          "nutrients": {
            "protein": grams of protein,
            "carbs": grams of carbohydrates,
            "fat": grams of fat,
            "fiber": grams of fiber
          },
          "confidence": 0.9
        }
      `;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return parsed as CalorieResult;
      } else {
        throw new Error('Failed to parse nutritional information');
      }
    } catch (error) {
      console.error('Error getting nutritional info:', error);
      throw new Error('Failed to get nutritional information');
    }
  }
}

export const geminiService = new GeminiService(); 