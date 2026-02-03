# ClawdMetrics Dashboard Skill

## Overview

This skill enables AI agents to understand and work with the ClawdMetrics Dashboard project - a Next.js-based metrics dashboard that displays leaderboard data from Supabase PostgreSQL.

## Project Information

- **Repository**: https://github.com/josecookai/clawdmetrics
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: Supabase PostgreSQL
- **UI Library**: Tremor, Recharts

## Architecture

```
┌─────────────────────────────────────────┐
│         Next.js Client (Browser)         │
│  ┌───────────────────────────────────┐  │
│  │  app/page.tsx (Client Component)  │  │
│  │  - useEffect hook                 │  │
│  │  - useState for data/loading     │  │
│  │  - supabase.rpc() call            │  │
│  └──────────────┬────────────────────┘  │
└─────────────────┼────────────────────────┘
                  │
                  │ HTTP POST
                  │ /rest/v1/rpc/get_leaderboard
                  │ Body: {"days_ago": 7}
                  │
┌─────────────────▼────────────────────────┐
│      Supabase PostgreSQL Database        │
│  ┌───────────────────────────────────┐   │
│  │  Function: get_leaderboard()     │   │
│  │  Parameters: days_ago INTEGER     │   │
│  │  Returns: TABLE(rank, user, score)│   │
│  └───────────────────────────────────┘   │
└───────────────────────────────────────────┘
```

## Key Files

### Core Application Files

**`app/page.tsx`**
- Client component (`'use client'`)
- Main dashboard page
- Fetches data using `supabase.rpc('get_leaderboard', { days_ago: 7 })`
- Handles loading, error, and success states
- Renders BarChart and Table components

**`lib/supabaseClient.ts`**
- Exports Supabase client instance
- Reads environment variables: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Validates environment variables exist

**`app/layout.tsx`**
- Root layout with dark theme
- Sets metadata

## Environment Variables

Required environment variables:
- `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase anonymous key (JWT token)

## Data Flow

1. Component mounts → `useEffect` triggers
2. Calls `supabase.rpc('get_leaderboard', { days_ago: 7 })`
3. Handles response:
   - Success: Parse and display data
   - Error: Show error message
4. Renders UI based on state

## Expected Data Format

The PostgreSQL function should return one of:
- Array: `[{rank, user, score}, ...]`
- Object: `{leaderboard: [{rank, user, score}, ...]}`

The code handles both formats and maps `user` field to `name` for display.

## Common Tasks

### Adding New Features
1. Check environment variables are set
2. Verify Supabase connection works
3. Test PostgreSQL function exists
4. Implement feature in `app/page.tsx`
5. Handle errors gracefully

### Debugging
- Check browser console for errors
- Verify environment variables in Vercel
- Test Supabase connection with test query
- Check function permissions for `anon` role

### Deployment
1. Set environment variables in Vercel
2. Ensure variables start with `NEXT_PUBLIC_`
3. Deploy and verify build succeeds
4. Test production deployment

## Documentation Links

- **Human Guide**: https://github.com/josecookai/clawdmetrics/blob/main/README_TO_HUMAN.md
- **Agent Guide**: https://github.com/josecookai/clawdmetrics/blob/main/README_TO_AGENT.md
- **Deployment**: https://github.com/josecookai/clawdmetrics/blob/main/DEPLOYMENT.md
- **Troubleshooting**: https://github.com/josecookai/clawdmetrics/blob/main/TROUBLESHOOTING.md

## Important Notes

- All API calls happen client-side (browser)
- No server-side API routes used
- Environment variables must start with `NEXT_PUBLIC_` for client access
- PostgreSQL function must exist and be callable by `anon` role
- Error handling is comprehensive with specific error messages

## When Working on This Project

1. Always verify environment variables first
2. Test Supabase connection before implementing features
3. Handle multiple data formats (array vs object)
4. Provide clear, actionable error messages
5. Use browser DevTools to debug API calls
6. Check function permissions in Supabase
