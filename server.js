import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { fileURLToPath } from 'url';

// Fix __dirname dan __filename untuk ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const modelName = process.env.GEMINI_MODEL || 'gemini-2.0-flash-lite';
const maxOutputTokens = Number(process.env.GEMINI_MAX_TOKENS) || 1000;

app.post('/api/chat', async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        const model = genAI.getGenerativeModel({
            model: modelName,
            generationConfig: { maxOutputTokens }
        });

        const contents = typeof message === 'string'
            ? [{ role: 'user', parts: [{ text: message }] }]
            : message;

        const result = await model.generateContent({ contents });
        const response = await result.response;

        console.log('Gemini raw response:', JSON.stringify(response, null, 2));

        const text = response.text();
        console.log('Gemini text output:', text);

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
});

// Static client build
const clientDistPath = path.join(__dirname, 'dist');

if (fs.existsSync(clientDistPath)) {
    app.use(express.static(clientDistPath));
    app.get(/^\/(?!api).*/, (req, res) => {
        res.sendFile(path.join(clientDistPath, 'index.html'));
    });
} else {
    console.warn('Client build not found. Run "npm run build" first.');
}

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
