/*
  # Create predictions table for PIGEON geolocation results

  1. New Tables
    - `predictions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, nullable - for future auth integration)
      - `image_url` (text) - URL or path to uploaded image
      - `predicted_lat` (numeric) - Predicted latitude
      - `predicted_lng` (numeric) - Predicted longitude
      - `confidence` (numeric, nullable) - Confidence score if available
      - `created_at` (timestamptz) - When prediction was made
      
  2. Security
    - Enable RLS on `predictions` table
    - Add policy for public read access (for demo purposes)
    - Add policy for public insert access (for demo purposes)
*/

CREATE TABLE IF NOT EXISTS predictions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  image_url text NOT NULL,
  predicted_lat numeric NOT NULL,
  predicted_lng numeric NOT NULL,
  confidence numeric,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE predictions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view predictions"
  ON predictions
  FOR SELECT
  USING (true);

CREATE POLICY "Anyone can create predictions"
  ON predictions
  FOR INSERT
  WITH CHECK (true);