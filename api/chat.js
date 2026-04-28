// v2
module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const apiKey = process.env.ANTHROPIC_API_KEY;
  console.log('Full key:', JSON.stringify(apiKey));
  console.log('API Key exists:', !!apiKey);
  console.log('API Key prefix:', apiKey ? apiKey.substring(0, 15) : 'MISSING');
  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch (e) { body = {}; }
  }
  if (!body) body = {};
  const { system, messages } = body;
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Invalid request body' });
  }
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1000,
        system: system,
        messages: messages
      })
    });
    const data = await response.json();
    if (!response.ok) {
      console.log('Anthropic error:', JSON.stringify(data));
      return res.status(response.status).json({ error: data.error?.message || 'API error' });
    }
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
