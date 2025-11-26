import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { message } = req.body;
        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        const modelName = process.env.GEMINI_MODEL || 'gemini-2.0-flash-lite';
        const maxOutputTokens = Number(process.env.GEMINI_MAX_TOKENS) || 1000;

        const model = genAI.getGenerativeModel({
            model: modelName,
            generationConfig: { maxOutputTokens }
        });

        const contents = typeof message === 'string'
            ? [{ role: 'user', parts: [{ text: message }] }]
            : message;

        const result = await model.generateContent({ contents });
        const response = await result.response;
        const text = response.text();

        res.json({ response: text });
    } catch (error) {
        console.error('Gemini API error:', error);

        const statusMap = {
            UNAUTHENTICATED: 401,
            PERMISSION_DENIED: 403,
            INVALID_ARGUMENT: 400,
            FAILED_PRECONDITION: 412,
            RESOURCE_EXHAUSTED: 429,
        };

        let statusCode =
            error?.response?.status ||
            error?.status ||
            statusMap[error?.status] ||
            500;

        const message = error?.message || 'Internal Server Error';
        res.status(statusCode).json({ error: message });
    }
}
