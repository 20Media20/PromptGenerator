# Dance Show Prompt Wizard – Required Refinement

This version always sends your base prompt to ChatGPT for optimisation on the final step. The app will not skip refinement. If the server does not have an `OPENAI_API_KEY`, you will see a clear error message with debug output.

## Run locally
```bash
npm install
npm run dev
```
Create `.env.local` with:
```
OPENAI_API_KEY=sk-proj-your-key
```
Restart `npm run dev` after adding the key.

## Deploy to Vercel
- Push to GitHub and import the repo to Vercel.
- In Project Settings, add `OPENAI_API_KEY` to Environment Variables.
- Redeploy.
