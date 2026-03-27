import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(request: Request) {
  try {
    const { moisture, temperature, humidity } = await request.json();

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "models/gemini-2.5-flash-lite" });

    const prompt = `You are a plant recommendation expert. Based on the following environmental conditions, recommend 3 indoor plants that would thrive.

Conditions:
- Soil Moisture: ${moisture}% (0% = bone dry, 100% = waterlogged)
- Temperature: ${temperature}°C
- Humidity: ${humidity}%

For each plant, provide:
1. Plant name
2. Scientific name
3. One sentence explaining why it matches these conditions

Return ONLY valid JSON in this exact format, no other text:
[
  {
    "name": "Plant Name",
    "scientificName": "Scientificus name",
    "reason": "Brief reason why this plant matches the conditions."
  }
]`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    let recommendations;
    try {
      recommendations = JSON.parse(responseText);
    } catch {
      const jsonMatch = responseText.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        recommendations = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('Could not parse AI response');
      }
    }

    return NextResponse.json({ recommendations });
  } catch (error) {
    console.error('AI Recommendation Error:', error);
    // Return error so frontend knows to show fallback
    return NextResponse.json(
      { error: 'AI service temporarily unavailable' },
      { status: 503 }
    );
  }
}