-- VidyaAI Database Setup
-- Run this in your Supabase SQL Editor

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  education_level TEXT,
  field_of_study TEXT,
  years_of_experience INTEGER DEFAULT 0,
  current_job_title TEXT,
  target_job_title TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create resumes table
CREATE TABLE IF NOT EXISTS resumes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content JSONB,
  ats_score INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create career_recommendations table
CREATE TABLE IF NOT EXISTS career_recommendations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  recommended_role TEXT NOT NULL,
  match_score INTEGER DEFAULT 0,
  reasoning TEXT,
  required_skills TEXT[],
  salary_range TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create skill_gaps table
CREATE TABLE IF NOT EXISTS skill_gaps (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  skill_name TEXT NOT NULL,
  importance TEXT NOT NULL,
  current_level TEXT NOT NULL,
  target_level TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create learning_roadmaps table
CREATE TABLE IF NOT EXISTS learning_roadmaps (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  target_role TEXT,
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create roadmap_items table
CREATE TABLE IF NOT EXISTS roadmap_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  roadmap_id UUID REFERENCES learning_roadmaps(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  resource_type TEXT NOT NULL,
  resource_url TEXT,
  estimated_duration TEXT,
  order_index INTEGER NOT NULL,
  is_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_resumes_user_id ON resumes(user_id);
CREATE INDEX IF NOT EXISTS idx_career_recommendations_user_id ON career_recommendations(user_id);
CREATE INDEX IF NOT EXISTS idx_skill_gaps_user_id ON skill_gaps(user_id);
CREATE INDEX IF NOT EXISTS idx_learning_roadmaps_user_id ON learning_roadmaps(user_id);
CREATE INDEX IF NOT EXISTS idx_roadmap_items_roadmap_id ON roadmap_items(roadmap_id);

-- Enable Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE career_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE skill_gaps ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_roadmaps ENABLE ROW LEVEL SECURITY;
ALTER TABLE roadmap_items ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users can view their own profile
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Users can insert their own profile
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Users can view their own resumes
CREATE POLICY "Users can view own resumes" ON resumes
  FOR SELECT USING (auth.uid() = user_id);

-- Users can manage their own resumes
CREATE POLICY "Users can manage own resumes" ON resumes
  FOR ALL USING (auth.uid() = user_id);

-- Users can view their own career recommendations
CREATE POLICY "Users can view own career recommendations" ON career_recommendations
  FOR SELECT USING (auth.uid() = user_id);

-- Users can manage their own career recommendations
CREATE POLICY "Users can manage own career recommendations" ON career_recommendations
  FOR ALL USING (auth.uid() = user_id);

-- Users can view their own skill gaps
CREATE POLICY "Users can view own skill gaps" ON skill_gaps
  FOR SELECT USING (auth.uid() = user_id);

-- Users can manage their own skill gaps
CREATE POLICY "Users can manage own skill gaps" ON skill_gaps
  FOR ALL USING (auth.uid() = user_id);

-- Users can view their own learning roadmaps
CREATE POLICY "Users can view own learning roadmaps" ON learning_roadmaps
  FOR SELECT USING (auth.uid() = user_id);

-- Users can manage their own learning roadmaps
CREATE POLICY "Users can manage own learning roadmaps" ON learning_roadmaps
  FOR ALL USING (auth.uid() = user_id);

-- Users can view their own roadmap items
CREATE POLICY "Users can view own roadmap items" ON roadmap_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM learning_roadmaps 
      WHERE learning_roadmaps.id = roadmap_items.roadmap_id 
      AND learning_roadmaps.user_id = auth.uid()
    )
  );

-- Users can manage their own roadmap items
CREATE POLICY "Users can manage own roadmap items" ON roadmap_items
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM learning_roadmaps 
      WHERE learning_roadmaps.id = roadmap_items.roadmap_id 
      AND learning_roadmaps.user_id = auth.uid()
    )
  );

-- Create function to handle new user profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create profile on signup
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
