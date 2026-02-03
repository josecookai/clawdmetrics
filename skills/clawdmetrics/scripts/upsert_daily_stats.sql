-- Supabase RPC Function: upsert_daily_stats
-- This function increments daily statistics for a user
-- It creates a new record if one doesn't exist for the current day

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
  -- This allows the function to work with both explicit user_id and JWT token
  IF p_user_id IS NULL THEN
    v_user_id := auth.uid();
  ELSE
    v_user_id := p_user_id;
  END IF;

  -- If still no user_id, raise an error
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

-- Grant execute permission to service_role and authenticated users
GRANT EXECUTE ON FUNCTION upsert_daily_stats(UUID, INTEGER, INTEGER, INTEGER) TO service_role;
GRANT EXECUTE ON FUNCTION upsert_daily_stats(UUID, INTEGER, INTEGER, INTEGER) TO authenticated;

-- Example table schema (create this table first):
/*
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

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_daily_stats_user_id ON daily_stats(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_stats_date ON daily_stats(date);

-- Enable Row Level Security (optional, but recommended)
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
*/
