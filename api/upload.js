// Vercel serverless function to proxy file uploads to document service
export const config = {
  api: {
    bodyParser: false, // Disable body parsing to handle multipart/form-data
  },
};

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get the raw body as a buffer
    const chunks = [];
    for await (const chunk of req) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);

    // Forward to backend document service
    const response = await fetch('http://34.78.185.56/api/document/upload', {
      method: 'POST',
      headers: {
        'Content-Type': req.headers['content-type'],
        'Content-Length': buffer.length.toString(),
      },
      body: buffer,
    });

    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (error) {
    console.error('Upload proxy error:', error);
    return res.status(500).json({
      error: 'Failed to upload file to backend',
      details: error.message
    });
  }
}
