import 'dotenv/config';
import fetch from 'node-fetch';

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

    const { oshiName, basicInfo, actions, unpurchasedGoods } = req.body;

    if (!oshiName || !actions || actions.length === 0 || !unpurchasedGoods) {
        return res.status(400).json({ error: "分析に必要なデータが不足しています。" });
    }

    const prompt = `
あなたは推し活アドバイザーです。
未購入のグッズリストを、ユーザーの推しの基本情報と感情記録をもとに分析してください。
各グッズの購入優先度を決定し、JSON形式で返してください。

【推しの名前】: ${oshiName}
【基本情報】: ${JSON.stringify(basicInfo, null, 2)}
【最近の感情記録】:
${actions.map(a => `- ${a.feeling}: ${a.action}`).join('\n')}

【未購入グッズリスト】:
${unpurchasedGoods.map(g => `- ID: ${g.id}, 名前: ${g.name}, 価格: ${g.price}, メモ: ${g.memo || 'なし'}`).join('\n')}

出力は以下のJSON配列形式のみで：
[
  {
    "id": "グッズのID",
    "aiPriority": "high" | "medium" | "low",
    "aiScore": 0-100,
    "aiReason": "理由"
  }
]
`;

    try {
        const apiKey = process.env.ANTHROPIC_API_KEY;
        if (!apiKey) {
            throw new Error("Server API Key is not configured");
        }

        const response = await fetch("https://api.anthropic.com/v1/messages", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": apiKey,
                "anthropic-version": "2023-06-01"
            },
            body: JSON.stringify({
                model: "claude-3-haiku-20240307",
                max_tokens: 2000,
                messages: [
                    { role: 'user', content: prompt }
                ]
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("🔥 Anthropic Error:", errorText);
            return res.status(500).json({ error: "Anthropic API error" });
        }

        const data = await response.json();
        const text = data.content?.[0]?.text || "";

        // JSONのみ抜き出してパース
        let parsed;
        try {
            parsed = JSON.parse(text.match(/\[[\s\S]*\]/)?.[0]);
        } catch (e) {
            console.error("JSON parse error:", text);
            return res.status(500).json({ error: "AIのJSON解析に失敗しました" });
        }

        res.json(parsed);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'AI分析に失敗しました' });
    }
}
