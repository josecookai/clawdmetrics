# ClawdMetrics Dashboard 🤖

> **To Agent**: Read this file to understand the project structure, implementation details, and how to interact with this codebase.

## 🎯 Project Overview

ClawdMetrics is a Next.js 14 dashboard application that displays leaderboard metrics by calling a PostgreSQL RPC function through Supabase. The application uses client-side data fetching with React hooks.

## 📐 Architecture

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
                  │ Headers: apikey, Authorization
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

## 🔑 Key Files

### Core Application Files

**`app/page.tsx`** (Client Component)
- Entry point for the dashboard
- Uses `'use client'` directive
- Implements data fetching with `useEffect`
- Calls `supabase.rpc('get_leaderboard', { days_ago: 7 })`
- Handles loading, error, and success states
- Renders BarChart (Tremor) and Table (Tremor) components

**`lib/supabaseClient.ts`**
- Exports Supabase client instance
- Reads `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` from environment
- Validates environment variables exist
- Creates client with `createClient(url, anonKey)`

**`app/layout.tsx`**
- Root layout component
- Sets dark theme (`className="dark"`)
- Configures metadata

### Configuration Files

**`package.json`**
- Dependencies: `@supabase/supabase-js`, `@tremor/react`, `next`, `react`, `react-dom`
- Scripts: `dev`, `build`, `start`, `lint`

**`.env.local`** (Not in git)
- Contains Supabase credentials
- Format: `NEXT_PUBLIC_SUPABASE_URL=...` and `NEXT_PUBLIC_SUPABASE_ANON_KEY=...`

## 🔄 Data Flow

1. **Page Load**: `useEffect` hook triggers on component mount
2. **API Call**: `supabase.rpc('get_leaderboard', { days_ago: 7 })` is called
3. **Response Handling**:
   - Success: Data parsed and set to state
   - Error: Error message displayed to user
4. **Rendering**: 
   - Loading state → "加载中..."
   - Error state → Red error box
   - Success state → Chart + Table

## 📋 Data Format

### Expected Response from RPC Function

```typescript
// Option 1: Direct array
[
  { rank: 1, user: "alice", score: 1200 },
  { rank: 2, user: "bob", score: 1100 }
]

// Option 2: Object with leaderboard key
{
  leaderboard: [
    { rank: 1, user: "alice", score: 1200 }
  ]
}
```

### Data Processing

The code handles multiple formats:
- Direct array → Used as-is
- `{leaderboard: [...]}` → Extracts array
- `{data: [...]}` → Extracts array
- Maps `user` field to `name` for display compatibility

## 🛠️ TODO List for Agent Implementation

### 🔴 Critical Tasks

- [ ] **Verify Supabase Connection**
  - [ ] Check `NEXT_PUBLIC_SUPABASE_URL` is set correctly
  - [ ] Verify `NEXT_PUBLIC_SUPABASE_ANON_KEY` is valid JWT token
  - [ ] Test connection with `supabase.from('_realtime').select('*').limit(0)`

- [ ] **Verify PostgreSQL Function Exists**
  - [ ] Check function `get_leaderboard` exists in database
  - [ ] Verify function signature: `get_leaderboard(days_ago INTEGER)`
  - [ ] Confirm function returns expected format
  - [ ] Test function permissions for `anon` role

- [ ] **Environment Variables**
  - [ ] Verify `.env.local` exists locally
  - [ ] Check Vercel environment variables are set
  - [ ] Ensure variables start with `NEXT_PUBLIC_` prefix
  - [ ] Verify values match Supabase project

### 🟡 Implementation Tasks

- [ ] **Error Handling Improvements**
  - [ ] Add retry logic for failed requests
  - [ ] Implement exponential backoff
  - [ ] Add network status detection
  - [ ] Handle timeout scenarios

- [ ] **Data Validation**
  - [ ] Validate response schema matches expected format
  - [ ] Add TypeScript types for function response
  - [ ] Handle malformed data gracefully
  - [ ] Add data sanitization

- [ ] **Performance Optimization**
  - [ ] Implement request debouncing
  - [ ] Add data caching with React Query or SWR
  - [ ] Optimize re-renders with useMemo
  - [ ] Lazy load chart components

### 🟢 Enhancement Tasks

- [ ] **Feature Additions**
  - [ ] Add refresh interval (polling)
  - [ ] Add manual refresh button
  - [ ] Implement time range selector
  - [ ] Add data export functionality

- [ ] **Code Quality**
  - [ ] Add unit tests for data processing
  - [ ] Add integration tests for API calls
  - [ ] Improve TypeScript type coverage
  - [ ] Add ESLint rules

## 🔍 Debugging Guide

### Check Environment Variables

```typescript
// In browser console
console.log('URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
console.log('KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 20))
```

### Test Supabase Connection

```typescript
import { supabase } from '@/lib/supabaseClient'

// Test connection
const { data, error } = await supabase.from('_realtime').select('*').limit(0)
console.log('Connection test:', { data, error })

// Test RPC function
const { data: rpcData, error: rpcError } = await supabase.rpc('get_leaderboard', { days_ago: 7 })
console.log('RPC test:', { rpcData, rpcError })
```

### Common Error Patterns

1. **"Invalid API key"**
   - Environment variable not set
   - Wrong variable name (missing `NEXT_PUBLIC_`)
   - Invalid JWT token format

2. **"Function not found"**
   - Function doesn't exist in database
   - Wrong function name
   - Permission denied for `anon` role

3. **"Network error"**
   - Supabase URL incorrect
   - CORS issues (shouldn't happen with RPC)
   - Network connectivity

## 📝 Code Patterns

### Data Fetching Pattern

```typescript
useEffect(() => {
  async function fetchData() {
    try {
      setLoading(true)
      const { data, error } = await supabase.rpc('get_leaderboard', { days_ago: 7 })
      if (error) throw error
      setData(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }
  fetchData()
}, [])
```

### Error Handling Pattern

```typescript
if (errorMessage.includes('Invalid API key')) {
  // Handle API key error
} else if (errorMessage.includes('function') && errorMessage.includes('does not exist')) {
  // Handle missing function
} else {
  // Generic error
}
```

## 🚀 Deployment Checklist

When deploying, ensure:

1. ✅ Environment variables set in Vercel
2. ✅ Variables prefixed with `NEXT_PUBLIC_`
3. ✅ PostgreSQL function deployed
4. ✅ Function permissions configured
5. ✅ Build succeeds (`npm run build`)
6. ✅ No TypeScript errors
7. ✅ No linting errors

## 📚 Reference Documentation

- [Supabase RPC Documentation](https://supabase.com/docs/reference/javascript/rpc)
- [Next.js Environment Variables](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables)
- [Tremor Components](https://www.tremor.so/docs)

## 🤖 Agent Instructions

When working on this project:

1. **Always check environment variables first** - Most issues stem from missing/incorrect env vars
2. **Verify Supabase connection** - Use test queries before implementing features
3. **Handle multiple data formats** - The code supports various response structures
4. **Provide clear error messages** - Users need actionable feedback
5. **Test in browser console** - Use DevTools to debug API calls
6. **Check function permissions** - RLS policies can block RPC calls

---

**Agent Note**: This project uses client-side data fetching. All API calls happen in the browser. No server-side API routes are used. The Supabase client is configured for client-side usage with `NEXT_PUBLIC_` prefixed environment variables.
