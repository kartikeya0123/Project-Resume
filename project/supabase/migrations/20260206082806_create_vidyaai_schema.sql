/*
  # VidyaAI Platform Schema

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key, references auth.users)
      - `email` (text)
      - `full_name` (text)
      - `education_level` (text)
      - `field_of_study` (text)
      - `years_of_experience` (integer)
      - `current_job_title` (text)
      - `target_job_title` (text)
      - `bio` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `resumes`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `title` (text)
      - `content` (jsonb) - stores structured resume data
      - `ats_score` (integer) - ATS optimization score
      - `is_active` (boolean)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `career_recommendations`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `recommended_role` (text)
      - `match_score` (integer)
      - `reasoning` (text)
      - `required_skills` (text[])
      - `salary_range` (text)
      - `created_at` (timestamptz)

    - `skills`
      - `id` (uuid, primary key)
      - `name` (text, unique)
      - `category` (text)
      - `description` (text)
      - `created_at` (timestamptz)

    - `user_skills`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `skill_id` (uuid, references skills)
      - `proficiency_level` (text)
      - `created_at` (timestamptz)

    - `skill_gaps`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `skill_name` (text)
      - `importance` (text)
      - `current_level` (text)
      - `target_level` (text)
      - `created_at` (timestamptz)

    - `learning_roadmaps`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `title` (text)
      - `target_role` (text)
      - `description` (text)
      - `is_active` (boolean)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `roadmap_items`
      - `id` (uuid, primary key)
      - `roadmap_id` (uuid, references learning_roadmaps)
      - `title` (text)
      - `description` (text)
      - `resource_type` (text) - course, book, project, etc.
      - `resource_url` (text)
      - `estimated_duration` (text)
      - `order_index` (integer)
      - `is_completed` (boolean)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
*/

CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text,
  education_level text,
  field_of_study text,
  years_of_experience integer DEFAULT 0,
  current_job_title text,
  target_job_title text,
  bio text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE TABLE IF NOT EXISTS resumes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  content jsonb DEFAULT '{}'::jsonb,
  ats_score integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE resumes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own resumes"
  ON resumes FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own resumes"
  ON resumes FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own resumes"
  ON resumes FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own resumes"
  ON resumes FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS career_recommendations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  recommended_role text NOT NULL,
  match_score integer DEFAULT 0,
  reasoning text,
  required_skills text[] DEFAULT ARRAY[]::text[],
  salary_range text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE career_recommendations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own career recommendations"
  ON career_recommendations FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own career recommendations"
  ON career_recommendations FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own career recommendations"
  ON career_recommendations FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  category text,
  description text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE skills ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view skills"
  ON skills FOR SELECT
  TO authenticated
  USING (true);

CREATE TABLE IF NOT EXISTS user_skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  skill_id uuid REFERENCES skills(id) ON DELETE CASCADE NOT NULL,
  proficiency_level text DEFAULT 'beginner',
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, skill_id)
);

ALTER TABLE user_skills ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own skills"
  ON user_skills FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own skills"
  ON user_skills FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own skills"
  ON user_skills FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own skills"
  ON user_skills FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS skill_gaps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  skill_name text NOT NULL,
  importance text DEFAULT 'medium',
  current_level text DEFAULT 'none',
  target_level text DEFAULT 'intermediate',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE skill_gaps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own skill gaps"
  ON skill_gaps FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own skill gaps"
  ON skill_gaps FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own skill gaps"
  ON skill_gaps FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own skill gaps"
  ON skill_gaps FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS learning_roadmaps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  target_role text,
  description text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE learning_roadmaps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own roadmaps"
  ON learning_roadmaps FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own roadmaps"
  ON learning_roadmaps FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own roadmaps"
  ON learning_roadmaps FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own roadmaps"
  ON learning_roadmaps FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS roadmap_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  roadmap_id uuid REFERENCES learning_roadmaps(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text,
  resource_type text DEFAULT 'course',
  resource_url text,
  estimated_duration text,
  order_index integer DEFAULT 0,
  is_completed boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE roadmap_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own roadmap items"
  ON roadmap_items FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM learning_roadmaps
      WHERE learning_roadmaps.id = roadmap_items.roadmap_id
      AND learning_roadmaps.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own roadmap items"
  ON roadmap_items FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM learning_roadmaps
      WHERE learning_roadmaps.id = roadmap_items.roadmap_id
      AND learning_roadmaps.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own roadmap items"
  ON roadmap_items FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM learning_roadmaps
      WHERE learning_roadmaps.id = roadmap_items.roadmap_id
      AND learning_roadmaps.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM learning_roadmaps
      WHERE learning_roadmaps.id = roadmap_items.roadmap_id
      AND learning_roadmaps.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own roadmap items"
  ON roadmap_items FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM learning_roadmaps
      WHERE learning_roadmaps.id = roadmap_items.roadmap_id
      AND learning_roadmaps.user_id = auth.uid()
    )
  );

CREATE INDEX IF NOT EXISTS idx_resumes_user_id ON resumes(user_id);
CREATE INDEX IF NOT EXISTS idx_career_recommendations_user_id ON career_recommendations(user_id);
CREATE INDEX IF NOT EXISTS idx_user_skills_user_id ON user_skills(user_id);
CREATE INDEX IF NOT EXISTS idx_skill_gaps_user_id ON skill_gaps(user_id);
CREATE INDEX IF NOT EXISTS idx_learning_roadmaps_user_id ON learning_roadmaps(user_id);
CREATE INDEX IF NOT EXISTS idx_roadmap_items_roadmap_id ON roadmap_items(roadmap_id);