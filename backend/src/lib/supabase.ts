import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const supabase = (function() {
  if (supabaseUrl && supabaseServiceKey && supabaseUrl.startsWith('http')) {
    try {
      return createClient(supabaseUrl, supabaseServiceKey);
    } catch (error) {
      console.warn('⚠️  Failed to create Supabase client, falling back to demo mode:', error);
    }
  }
  
  console.warn('⚠️  Backend will run in demo mode - no database connection');
  // Create a mock supabase client for demo mode
  return {
    from: (table: string) => ({
      select: () => ({
        eq: () => ({
          single: () => Promise.resolve({ data: null, error: { message: 'Demo mode - no database connection' } }),
          maybeSingle: () => Promise.resolve({ data: null, error: { message: 'Demo mode - no database connection' } }),
          order: () => Promise.resolve({ data: [], error: null })
        })
      }),
      insert: () => Promise.resolve({ data: null, error: { message: 'Demo mode - no database connection' } }),
      update: () => ({
        eq: () => Promise.resolve({ data: null, error: { message: 'Demo mode - no database connection' } })
      }),
      delete: () => ({
        eq: () => Promise.resolve({ error: { message: 'Demo mode - no database connection' } })
      })
    }),
    auth: {
      getUser: () => Promise.resolve({ data: { user: null }, error: { message: 'Demo mode - no auth connection' } })
    }
  };
})();

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
