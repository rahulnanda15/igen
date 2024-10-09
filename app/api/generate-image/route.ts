import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

// Helper function for making the OpenAI request with retries
async function fetchOpenAIImage(prompt: string, retryCount = 0): Promise<string> {
  try {
    const apiKey = process.env.OPENAI_API_KEY;

    // Make the request to OpenAI's image generation API
    const response = await axios.post(
      'https://api.openai.com/v1/images/generations',
      {
        prompt,
        n: 1,  // Number of images to generate
        size: '256x256',
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data.data[0].url;

  } catch (error) {
    // Retry the request up to 3 times if it fails due to network or timeout issues
    if (retryCount < 3) {
      console.warn(`Retrying request... attempt ${retryCount + 1}`);
      return fetchOpenAIImage(prompt, retryCount + 1);
    }
    throw error; // After 3 retries, throw the error
  }
}

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

    // Fetch the image URL with retries
    const imageUrl = await fetchOpenAIImage(prompt);

    return NextResponse.json({ imageUrl }, { status: 200 });

  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error generating image:', error.message);
      return NextResponse.json({ message: 'Failed to generate image', error: error.message }, { status: 500 });
    }
    return NextResponse.json({ message: 'Unknown error occurred' }, { status: 500 });
  }
}
