import { NextResponse } from 'next/server';

const CATEGORY_LABELS = {
    'premium-watches': 'Premium Watch',
    'casual-watches': 'Casual Watch',
    'stylish-watches': 'Stylish Watch',
    'women-watches': "Women's Watch",
    'belts': 'Leather Belt',
    'wallets': 'Wallet',
};

const CATEGORY_PREFIXES = {
    'premium-watches': 'PW',
    'casual-watches': 'CW',
    'stylish-watches': 'SW',
    'women-watches': 'WW',
    'belts': 'BLT',
    'wallets': 'WLT',
};

export async function POST(request) {
    const { name, category, price, notes } = await request.json();

    if (!name || !category) {
        return NextResponse.json({ error: 'Product name and category are required' }, { status: 400 });
    }

    if (!process.env.ANTHROPIC_API_KEY) {
        return NextResponse.json(
            { error: 'ANTHROPIC_API_KEY is not set in your .env file' },
            { status: 500 }
        );
    }

    const categoryLabel = CATEGORY_LABELS[category] || category;
    const prefix = CATEGORY_PREFIXES[category] || 'TTS';
    const code = `${prefix}-${String(Math.floor(Math.random() * 900) + 100)}`;

    const prompt = `You are a product copywriter for "The Trend Seller", a Pakistani e-commerce store selling premium watches, belts, and wallets.

Write product content for:
- Name: ${name}
- Type: ${categoryLabel}
- Price: ${price ? `Rs. ${price}` : 'not specified'}
${notes ? `- Extra details: ${notes}` : ''}

Return ONLY a valid JSON object — no markdown, no explanation:
{
  "description": "2-3 sentences. Compelling, professional English. Highlight quality and style. Relevant to Pakistani buyers.",
  "features": ["short feature 1", "short feature 2", "short feature 3", "short feature 4", "short feature 5"],
  "metaTitle": "SEO title under 60 chars — include product name and brand The Trend Seller",
  "metaDescription": "SEO description under 160 chars — benefit-focused for Google search"
}

Each feature must be under 10 words. Do not include the product code in the JSON.`;

    try {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'x-api-key': process.env.ANTHROPIC_API_KEY,
                'anthropic-version': '2023-06-01',
                'content-type': 'application/json',
            },
            body: JSON.stringify({
                model: 'claude-haiku-4-5-20251001',
                max_tokens: 800,
                messages: [{ role: 'user', content: prompt }],
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Claude API error ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        const text = data.content?.[0]?.text ?? '';

        const match = text.match(/\{[\s\S]*\}/);
        if (!match) throw new Error('Could not parse AI response as JSON');

        const generated = JSON.parse(match[0]);
        return NextResponse.json({ ...generated, productCode: code });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
