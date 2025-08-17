/*
  # Create complaints table for cybercrime reports

  1. New Tables
    - `complaints`
      - `id` (text, primary key) - Complaint ID like CR123456
      - `user_id` (text) - Reference to users.user_id
      - `category` (text) - Main category
      - `subcategory` (text) - Subcategory
      - `title` (text) - Brief title
      - `description` (text) - Detailed description
      - `incident_date` (date) - When incident occurred
      - `location` (text) - Location of incident
      - `suspicious_entity` (text) - Suspicious website/phone/UPI etc
      - `financial_loss` (numeric) - Amount lost if any
      - `urgency_level` (text) - low/medium/high/critical
      - `is_anonymous` (boolean) - Anonymous reporting
      - `status` (text) - submitted/investigating/resolved etc
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `complaints` table
    - Add policies for users to manage their own complaints
    - Add policies for officials to view all complaints
*/

CREATE TABLE IF NOT EXISTS complaints (
  id text PRIMARY KEY,
  user_id text NOT NULL,
  category text NOT NULL,
  subcategory text NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  incident_date date,
  location text,
  suspicious_entity text,
  financial_loss numeric,
  urgency_level text DEFAULT 'medium',
  is_anonymous boolean DEFAULT false,
  status text DEFAULT 'submitted',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE complaints ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own complaints"
  ON complaints
  FOR SELECT
  TO authenticated
  USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert own complaints"
  ON complaints
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Allow anonymous complaint reading"
  ON complaints
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow anonymous complaint insertion"
  ON complaints
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_complaints_user_id ON complaints(user_id);
CREATE INDEX IF NOT EXISTS idx_complaints_status ON complaints(status);
CREATE INDEX IF NOT EXISTS idx_complaints_created_at ON complaints(created_at);