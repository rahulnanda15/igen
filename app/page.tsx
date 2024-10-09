'use client';

import { useState } from 'react';

export default function Home() {
  const [input, setInput] = useState<string>(''); // User input
  const [output, setOutput] = useState<string | null>(null); // URL of generated image
  const [loading, setLoading] = useState<boolean>(false); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state

  const generateImage = async () => {
    if (!input) {
      setError('Please enter an image idea.');
      return;
    }

    setLoading(true); // Set loading state while waiting for response
    setError(null); // Reset error message
    setOutput(null); // Reset previous output

    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: input }), // Send the input as a prompt
      });

      const data = await response.json();

      if (response.ok) {
        setOutput(data.imageUrl); // Set the image URL to display the image
      } else {
        setError(data.message || 'Failed to generate image.');
      }
    } catch (err) {
      setError('An error occurred while generating the image.');
    } finally {
      setLoading(false); // Stop loading once the request is complete
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <div style={{ marginBottom: '20px' }}>
        <h2>Generate an Image</h2>
        <input
          type="text"
          placeholder="Enter an image idea..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{ width: '100%', padding: '10px', fontSize: '16px' }}
        />
      </div>

      <div>
        <button
          onClick={generateImage}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: '#0070f3',
            color: '#fff',
            border: 'none',
            cursor: 'pointer',
          }}
          disabled={loading}
        >
          {loading ? 'Generating...' : 'Generate Image'}
        </button>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {output && (
        <div style={{ marginTop: '20px' }}>
          <h3>Generated Image:</h3>
          <img src={output} alt="Generated" style={{ maxWidth: '100%', height: 'auto' }} />
        </div>
      )}
    </div>
  );
}
