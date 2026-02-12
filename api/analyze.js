import 'dotenv/config';
import fetch from 'node-fetch';

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

    const { oshiName, basicInfo, actions } = req.body;

    const prompt = `あなたはプロの「推し活カウンセラー」です。
ユーザーが提供する「推しの基本情報」と「行動記録（感情ログ）」を分析し、ユーザーがその推しに惹かれている本質的な理由、少し感じているモヤモヤ、そして今後の推し活へのアドバイスを行ってください。

【推しの名前】
${oshiName}

【推しの基本情報】
${JSON.stringify(basicInfo, null, 2)}

【行動記録】
${JSON.stringify(actions, null, 2)}

【出力フォーマット】
以下のJSON形式で出力してください。Markdownのコードブロックは不要です。純粋なJSONのみを返してください。

{
  "attraction": "ユーザーがこの推しに惹かれている魅力の本質（300文字程度）。具体的な行動ログを引用しながら分析してください。",
  "concerns": "ユーザーが少し気になっている点や苦手に感じている要素（200文字程度）。もし該当するネガティブなログがなければ、「特になし」としつつ、今後気をつけたほうが良い視点を提案してください。",
  "conclusion": "ズバリ、ユーザーはこの推しの「○○なところ」が大好き（50文字程度の一言まとめ）",
  "recommendations": [
    {
      "name": "おすすめのコンテンツや楽しみ方、または似た傾向の他ジャンルのキャラなど",
      "reason": "その理由（100文字程度）"
    },
    {
      "name": "もう一つの提案",
      "reason": "その理由"
    },
    {
      "name": "さらなる提案",
      "reason": "その理由"
    }
  ],
  "hint": "これからの推し活をもっと楽しく、または健全に続けるためのワンポイントアドバイス（100文字程度）"
}`;

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
                messages: [{ role: 'user', content: prompt }]
            })
        });

        if (!response.ok) {
            const text = await response.text();
            console.error("Anthropic error:", text);
            return res.status(500).json({ error: "AI service unavailable", details: text });
        }

        const data = await response.json();
        const text = data.content?.[0]?.text || "";

        // JSON Parsing with fallback for Markdown code blocks
        let jsonResult;
        try {
            // Try extracting JSON from code blocks if present
            const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/) || text.match(/```\s*([\s\S]*?)\s*```/);
            const jsonString = jsonMatch ? jsonMatch[1] : text;
            jsonResult = JSON.parse(jsonString);
        } catch (e) {
            console.error("JSON Parse Error:", e);
            console.error("Raw Text:", text);
            return res.status(500).json({ error: "Failed to parse AI response" });
        }

        res.json(jsonResult);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "AI分析に失敗しました" });
    }
}
