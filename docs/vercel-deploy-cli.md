# Vercel Deploy CLI

Use the project deploy wrapper after committing local changes:

```powershell
npm run deploy:vercel
```

The wrapper performs the fixed release flow:

1. Requires a clean Git working tree.
2. Verifies Vercel CLI login.
3. Reads `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` from `.env`.
4. Updates Vercel `production` and `preview` environment variables.
5. Runs `npm run build`.
6. Deploys with `vercel --prod --yes`.
7. Verifies the production bundle includes Supabase env values.

The script does not print secret values. It only prints variable names and value lengths.

Default production URL:

```text
https://card-nine-livid.vercel.app
```

Override the verification URL if needed:

```powershell
$env:CARD_PROD_URL="https://your-production-url.vercel.app"
npm run deploy:vercel
```
