import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const { address } = req.body;
  const attomApiKey = process.env.ATTOM_API_KEY;
  const openaiApiKey = process.env.OPENAI_API_KEY;

  try {
    const attomRes = await axios.get(`https://api.gateway.attomdata.com/propertyapi/v1.0.0/property/address?address=${encodeURIComponent(address)}`, {
      headers: { apikey: attomApiKey }
    });

    const propertyDetails = JSON.stringify(attomRes.data, null, 2);

    const openaiRes = await axios.post("https://api.openai.com/v1/chat/completions", {
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are a helpful real estate valuation assistant." },
        { role: "user", content: `Estimate the current value of the following property using only the provided data: ${propertyDetails}` }
      ]
    }, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${openaiApiKey}`
      }
    });

    const valuation = openaiRes.data.choices[0].message.content;
    res.status(200).json({ valuation });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to retrieve valuation' });
  }
}