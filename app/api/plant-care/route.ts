import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const image = formData.get('image') as File;
    
    if (!image) {
      return NextResponse.json(
        { error: 'No image provided' },
        { status: 400 }
      );
    }

    const bytes = await image.arrayBuffer();
    const base64Image = Buffer.from(bytes).toString('base64');
    const mimeType = image.type;

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });

    const prompt = `You are a plant care expert for Philippine home gardening. Identify this plant from the image and provide:

1. Plant name (common Filipino name if available)
2. Scientific name
3. Care instructions including:
   - Watering frequency
   - Sunlight requirements
   - Ideal temperature range
   - Humidity preference
   - Soil type
   - Common issues to watch for

Format your response as JSON:
{
  "name": "Plant Name",
  "scientificName": "Scientific name",
  "watering": "Watering instructions",
  "sunlight": "Sunlight requirements",
  "temperature": "Ideal temperature range",
  "humidity": "Humidity preference",
  "soil": "Soil type recommendation",
  "commonIssues": "Common problems and solutions"
}`;

    const result = await model.generateContent([
      { text: prompt },
      {
        inlineData: {
          mimeType: mimeType,
          data: base64Image,
        },
      },
    ]);

    const responseText = result.response.text();
    
    let careData;
    try {
      let cleaned = responseText.trim();
      if (cleaned.startsWith('```json')) cleaned = cleaned.substring(7);
      if (cleaned.startsWith('```')) cleaned = cleaned.substring(3);
      if (cleaned.endsWith('```')) cleaned = cleaned.substring(0, cleaned.length - 3);
      cleaned = cleaned.trim();
      careData = JSON.parse(cleaned);
    } catch {
      careData = {
        name: 'Unknown Plant',
        scientificName: '',
        watering: 'Water when topsoil feels dry',
        sunlight: 'Bright indirect sunlight',
        temperature: '18-28°C',
        humidity: '40-60%',
        soil: 'Well-draining potting mix',
        commonIssues: 'Watch for yellowing leaves or pests',
      };
    }

    return NextResponse.json({ careData });
  } catch (error) {
    console.error('Plant care error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze plant' },
      { status: 500 }
    );
  }
}