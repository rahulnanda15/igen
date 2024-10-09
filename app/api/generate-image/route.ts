import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();

    // Log the prompt received
    if (!prompt || typeof prompt !== 'string') {
      console.log('Invalid prompt:', prompt);
      return NextResponse.json({ message: 'Invalid prompt' }, { status: 400 });
    }

    console.log('Prompt received:', prompt);

    const apiKey = process.env.OPENAI_API_KEY;

    // Ensure the API key is available
    if (!apiKey) {
      console.error('OpenAI API key is missing');
      return NextResponse.json({ message: 'OpenAI API key is missing' }, { status: 500 });
    }

    console.log('Using API key:', apiKey);

    // Make the request to OpenAI's image generation API
    const response = await axios.post(
      'https://api.openai.com/v1/images/generations',
      {
        prompt,
        n: 1,  // Number of images to generate
        size: '1024x1024',
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('OpenAI response:', response.data);

    const imageUrl = response.data.data[0].url;
    return NextResponse.json({ imageUrl }, { status: 200 });

  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error generating image:', error.message);
      return NextResponse.json({ message: 'Failed to generate image' }, { status: 500 });
    }
    return NextResponse.json({ message: 'Unknown error occurred' }, { status: 500 });
  }
}
