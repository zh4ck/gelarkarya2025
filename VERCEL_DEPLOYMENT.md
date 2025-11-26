# Vercel Deployment Instructions

## Setup Steps

1. **Add Environment Variable in Vercel Dashboard:**
   - Go to your Vercel project settings
   - Navigate to "Environment Variables"
   - Add: `GEMINI_API_KEY` with your actual API key value
   - Optionally add `GEMINI_MODEL` and `GEMINI_MAX_TOKENS` if you want to customize them

2. **Deploy:**
   - Push your code to GitHub (make sure the `api` folder is included)
   - Vercel will automatically detect the serverless function
   - The API will be available at `/api/chat`

3. **Project Structure:**
   ```
   /api
     /chat.js          - Serverless function for Gemini API
   /src
     ...               - Your React app
   vercel.json         - Vercel configuration
   ```

## API Endpoint

- **Endpoint:** `/api/chat`
- **Method:** POST
- **Body:**
  ```json
  {
    "message": "Your prompt here"
  }
  ```

## Local Development

For local development, you can still use:
```bash
npm run start
```

This will run the Express server on port 3000.

## Vercel Deployment

The `/api/chat` endpoint will work automatically on Vercel as a serverless function.
