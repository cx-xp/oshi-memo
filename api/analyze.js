import Anthropic from "@anthropic-ai/sdk";

export async function POST(request) {
    const body = await request.json();

    const anthropic = new Anthropic({
        apiKey: process.env.ANTHROPIC_API_KEY,
    });

    const msg = await anthropic.messages.create({
        model: "claude-3-haiku-20240307",
        max_tokens: 1000,
        messages: [
            {
                role: "user",
                content: `推し名: ${body.oshiName}
基本情報: ${JSON.stringify(body.basicInfo)}
行動記録: ${JSON.stringify(body.actions)}

この推しへの感情傾向を分析してください。`
            }
        ],
    });

    return new Response(
        JSON.stringify({ result: msg.content[0].text }),
        { status: 200 }
    );
}
