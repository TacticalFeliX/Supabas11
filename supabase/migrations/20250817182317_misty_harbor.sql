/*
  # Create suspicious entities table

  1. New Tables
    - `suspicious_entities`
      - `id` (text, primary key) - Report ID like SR123456
      - `user_id` (text) - Reporter user ID
      - `entity_type` (text) - Type of entity (website, phone, etc)
      - `entity_value` (text) - The actual suspicious entity
      - `suspicion_reason` (text) - Why it's suspicious
      - `description` (text) - Detailed description
      - `risk_level` (text) - low/medium/high/critical
      - `encountered_where` (text) - Where user encountered this
      - `additional_info` (text) - Extra information
      - `status` (text) - under_analysis/verified/blocked etc
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `suspicious_entities` table
    - Add policies for users to manage their own reports
    - Add policies for officials to view all reports
*/

CREATE TABLE IF NOT EXISTS suspicious_entities (
  id text PRIMARY KEY,
  user_id text NOT NULL,
  entity_type text NOT NULL,
  entity_value text NOT NULL,
  suspicion_reason text NOT NULL,
  description text NOT NULL,
  risk_level text DEFAULT 'medium',
  encountered_where text,
  additional_info text,
  status text DEFAULT 'under_analysis',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE suspicious_entities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own reports"
  ON suspicious_entities
  FOR SELECT
  TO authenticated
  USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert own reports"
  ON suspicious_entities
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Allow anonymous entity reading"
  ON suspicious_entities
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow anonymous entity insertion"
  ON suspicious_entities
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_suspicious_entities_user_id ON suspicious_entities(user_id);
CREATE INDEX IF NOT EXISTS idx_suspicious_entities_status ON suspicious_entities(status);
CREATE INDEX IF NOT EXISTS idx_suspicious_entities_entity_type ON suspicious_entities(entity_type);