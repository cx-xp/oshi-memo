import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Main Analyze Endpoint
app.post('/analyze', async (req, res) => {
  try {
    const apiKey = req.headers['x-api-key'];
    if (!apiKey) {
      return res.status(401).json({ error: "API Key is missing." });
    }

    const { model, max_tokens, messages, system } = req.body;

    const bodyData = { model, max_tokens, messages };
    if (system) bodyData.system = system;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify(bodyData)
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({ error: errorText });
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Proxy Error (/analyze):", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Emotion Endpoint
app.post('/api/analyze-emotion', async (req, res) => {
  try {
    const apiKey = req.headers['x-api-key'];
    if (!apiKey) {
      return res.status(401).json({ error: "API Key is missing." });
    }

    const { oshiName, basicInfo, action, context, feeling, messages } = req.body;
    
    // Fallback if the frontend didn't pass constructed messages
    const actualMessages = (messages && messages.length > 0) ? messages : [
          { role: 'user', content: `【推しの行動】: ${action}\n【状況】: ${context}\n【私の感情】: ${feeling === 'positive' ? 'プラス（好き・嬉しい）' : 'マイナス（残念・苦手）'}\n\nこのことについて話を聞いてください。` }
    ];

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-3-sonnet-20240229",
        max_tokens: 1000,
        system: `あなたは推し活カウンセラーです。推しの行動と、それに対するユーザーの感情記録を読み取り、ユーザーの気持ちに寄り添いながら対話してください。推しの名前は「${oshiName}」です。`,
        messages: actualMessages
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({ error: errorText });
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Proxy Error (/api/analyze-emotion):", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
});
