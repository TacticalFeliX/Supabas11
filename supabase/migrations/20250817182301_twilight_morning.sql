/*
  # Create users table for CyberGuard authentication

  1. New Tables
    - `users`
      - `id` (uuid, primary key)
      - `user_id` (text, unique) - Generated user ID like CG123456
      - `name` (text) - Full name
      - `aadhaar_number` (text) - Encrypted Aadhaar number
      - `phone_number` (text) - Phone number
      - `address` (text) - Address
      - `user_type` (text) - 'user' or 'official'
      - `government_id` (text, optional) - For officials
      - `password_hash` (text) - Hashed password
      - `is_verified` (boolean) - Verification status
      - `created_at` (timestamp)
      - `last_login` (timestamp)

  2. Security
    - Enable RLS on `users` table
    - Add policy for users to read their own data
    - Add policy for authenticated users to update their own data
*/

CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text UNIQUE NOT NULL,
  name text NOT NULL,
  aadhaar_number text NOT NULL,
  phone_number text NOT NULL,
  address text NOT NULL,
  user_type text NOT NULL DEFAULT 'user',
  government_id text,
  password_hash text,
  is_verified boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  last_login timestamptz
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid()::text = user_id);

CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = user_id);

CREATE POLICY "Allow user registration"
  ON users
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow user login"
  ON users
  FOR SELECT
  TO anon
  USING (true);