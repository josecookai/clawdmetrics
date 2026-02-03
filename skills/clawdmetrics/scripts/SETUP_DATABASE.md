# Database Setup Guide for Stats Reporting

## 📋 Overview

This guide explains how to set up the database schema and RPC function required for the `report_stats.py` script.

## 🗄️ Step 1: Create the Table

Run this SQL in your Supabase SQL Editor:

```sql
CREATE TABLE IF NOT EXISTS daily_stats (
  date DATE NOT NULL,
  user_id UUID NOT NULL,
  interaction_count INTEGER DEFAULT 0,
  input_tokens INTEGER DEFAULT 0,
  output_tokens INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (date, user_id),
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_daily_stats_user_id ON daily_stats(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_stats_date ON daily_stats(date);
```

## 🔒 Step 2: Enable Row Level Security (Optional but Recommended)

```sql
ALTER TABLE daily_stats ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own stats
CREATE POLICY "Users can view their own stats"
  ON daily_stats
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Service role can do everything
CREATE POLICY "Service role has full access"
  ON daily_stats
  FOR ALL
  USING (auth.role() = 'service_role');
```

## ⚙️ Step 3: Create the RPC Function

Copy and run the SQL from `upsert_daily_stats.sql` in your Supabase SQL Editor, or run:

```sql
CREATE OR REPLACE FUNCTION upsert_daily_stats(
  p_user_id UUID DEFAULT NULL,
  p_interaction_count INTEGER DEFAULT 0,
  p_input_tokens INTEGER DEFAULT 0,
  p_output_tokens INTEGER DEFAULT 0
)
RETURNS TABLE (
  date DATE,
  user_id UUID,
  interaction_count INTEGER,
  input_tokens INTEGER,
  output_tokens INTEGER,
  updated_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_id UUID;
  v_date DATE := CURRENT_DATE;
BEGIN
  -- If user_id is not provided, try to get it from auth.uid()
  IF p_user_id IS NULL THEN
    v_user_id := auth.uid();
  ELSE
    v_user_id := p_user_id;
  END IF;

  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'User ID is required';
  END IF;

  -- Upsert the daily stats
  INSERT INTO daily_stats (
    date,
    user_id,
    interaction_count,
    input_tokens,
    output_tokens,
    updated_at
  )
  VALUES (
    v_date,
    v_user_id,
    COALESCE(p_interaction_count, 0),
    COALESCE(p_input_tokens, 0),
    COALESCE(p_output_tokens, 0),
    NOW()
  )
  ON CONFLICT (date, user_id)
  DO UPDATE SET
    interaction_count = daily_stats.interaction_count + COALESCE(p_interaction_count, 0),
    input_tokens = daily_stats.input_tokens + COALESCE(p_input_tokens, 0),
    output_tokens = daily_stats.output_tokens + COALESCE(p_output_tokens, 0),
    updated_at = NOW()
  RETURNING *;
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION upsert_daily_stats(UUID, INTEGER, INTEGER, INTEGER) TO service_role;
GRANT EXECUTE ON FUNCTION upsert_daily_stats(UUID, INTEGER, INTEGER, INTEGER) TO authenticated;
```

## ✅ Step 4: Verify Setup

Test the function in Supabase SQL Editor:

```sql
-- Test with explicit user_id
SELECT * FROM upsert_daily_stats(
  'your-user-id-here'::UUID,
  10,
  5000,
  3000
);

-- Test without user_id (will use auth.uid() if authenticated)
SELECT * FROM upsert_daily_stats(
  NULL,
  5,
  2500,
  1500
);
```

## 🔑 Step 5: Get Service Role Key

1. Go to Supabase Dashboard
2. Navigate to **Settings** → **API**
3. Copy the **service_role** key (not the anon key!)
4. Set it as environment variable:
   ```bash
   export SUPABASE_SERVICE_KEY='your_service_role_key_here'
   ```

## 🚀 Step 6: Test the Script

```bash
# Make sure you have a session file first
python exchange_code.py <auth_code>

# Then report stats
python report_stats.py 10 5000 3000
```

## 📊 Function Behavior

The `upsert_daily_stats` function:

1. **Creates** a new record if one doesn't exist for today
2. **Increments** existing values if a record exists for today
3. **Uses** the current date automatically
4. **Accepts** user_id explicitly or uses auth.uid() from JWT token

## 🔍 Querying Stats

```sql
-- Get today's stats for a user
SELECT * FROM daily_stats
WHERE user_id = 'your-user-id' AND date = CURRENT_DATE;

-- Get all stats for a user
SELECT * FROM daily_stats
WHERE user_id = 'your-user-id'
ORDER BY date DESC;

-- Get aggregated stats
SELECT 
  SUM(interaction_count) as total_interactions,
  SUM(input_tokens) as total_input_tokens,
  SUM(output_tokens) as total_output_tokens
FROM daily_stats
WHERE user_id = 'your-user-id';
```

## ⚠️ Important Notes

- The function uses `SECURITY DEFINER` to run with elevated privileges
- Service role key bypasses RLS policies
- The function increments values, not overwrites them
- Date is automatically set to CURRENT_DATE
