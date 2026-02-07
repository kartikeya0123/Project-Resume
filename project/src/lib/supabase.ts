import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  education_level: string | null;
  field_of_study: string | null;
  years_of_experience: number;
  current_job_title: string | null;
  target_job_title: string | null;
  bio: string | null;
  created_at: string;
  updated_at: string;
};

export type Resume = {
  id: string;
  user_id: string;
  title: string;
  content: any;
  ats_score: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type CareerRecommendation = {
  id: string;
  user_id: string;
  recommended_role: string;
  match_score: number;
  reasoning: string | null;
  required_skills: string[];
  salary_range: string | null;
  created_at: string;
};

export type SkillGap = {
  id: string;
  user_id: string;
  skill_name: string;
  importance: string;
  current_level: string;
  target_level: string;
  created_at: string;
};

export type LearningRoadmap = {
  id: string;
  user_id: string;
  title: string;
  target_role: string | null;
  description: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type RoadmapItem = {
  id: string;
  roadmap_id: string;
  title: string;
  description: string | null;
  resource_type: string;
  resource_url: string | null;
  estimated_duration: string | null;
  order_index: number;
  is_completed: boolean;
  created_at: string;
};
