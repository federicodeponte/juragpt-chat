// Vercel serverless function to proxy API requests to backend
export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const backendURL = 'http://34.78.185.56:8888/query';

  try {
    console.log('[Vercel Proxy] Calling backend:', backendURL);
    console.log('[Vercel Proxy] Request body:', JSON.stringify(req.body));

    const response = await fetch(backendURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body),
    });

    console.log('[Vercel Proxy] Response status:', response.status);
    const data = await response.json();
    console.log('[Vercel Proxy] Response data:', JSON.stringify(data).substring(0, 200));

    return res.status(response.status).json(data);
  } catch (error) {
    console.error('[Vercel Proxy] Error:', error.message, error.cause);
    return res.status(500).json({
      error: 'Failed to reach backend API',
      details: error.message,
      cause: error.cause?.toString(),
      backendURL: backendURL
    });
  }
}
