/*
  # Initial Schema Setup

  1. New Tables
    - `services`
      - `id` (uuid, primary key)
      - `vehicle` (text)
      - `license_plate` (text)
      - `type` (text)
      - `value` (numeric)
      - `date` (timestamptz)
      - `user_id` (uuid, foreign key)
    
    - `goals`
      - `id` (uuid, primary key)
      - `type` (text)
      - `value` (numeric)
      - `user_id` (uuid, foreign key)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users
*/

CREATE TABLE services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle text NOT NULL,
  license_plate text NOT NULL,
  type text NOT NULL,
  value numeric NOT NULL,
  date timestamptz DEFAULT now(),
  user_id uuid NOT NULL REFERENCES auth.users(id)
);

CREATE TABLE goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL,
  value numeric NOT NULL,
  user_id uuid NOT NULL REFERENCES auth.users(id),
  UNIQUE(type, user_id)
);

ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own services"
  ON services
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage their own goals"
  ON goals
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);