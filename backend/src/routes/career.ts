import { Router } from 'express';
import { supabase } from '../lib/supabase';

const router = Router();

// Get career recommendations
router.get('/recommendations', async (req, res) => {
  try {
    const { userId } = req.query;
    
    if (!userId) {
      return res.status(400).json({ error: { message: 'User ID is required' } });
    }

    const { data, error } = await supabase
      .from('career_recommendations')
      .select('*')
      .eq('user_id', userId)
      .order('match_score', { ascending: false });

    if (error) {
      return res.status(400).json({ error: { message: error.message } });
    }

    res.status(200).json({ data });
  } catch (error: any) {
    res.status(500).json({ error: { message: error.message } });
  }
});

// Generate new career recommendations
router.post('/recommendations', async (req, res) => {
  try {
    const { userId, profileData } = req.body;
    
    if (!userId || !profileData) {
      return res.status(400).json({ error: { message: 'User ID and profile data are required' } });
    }

    // Mock AI-generated career recommendations
    const mockRecommendations = [
      {
        user_id: userId,
        recommended_role: 'Senior Software Engineer',
        match_score: 85,
        reasoning: 'Based on your experience and skills, you\'re well-suited for senior roles',
        required_skills: ['JavaScript', 'React', 'Node.js', 'Leadership'],
        salary_range: '$120,000 - $180,000'
      },
      {
        user_id: userId,
        recommended_role: 'Full Stack Developer',
        match_score: 78,
        reasoning: 'Your full-stack experience makes you a strong candidate',
        required_skills: ['Frontend', 'Backend', 'Database', 'DevOps'],
        salary_range: '$100,000 - $150,000'
      }
    ];

    const { data, error } = await supabase
      .from('career_recommendations')
      .insert(mockRecommendations)
      .select();

    if (error) {
      return res.status(400).json({ error: { message: error.message } });
    }

    res.status(201).json({ data });
  } catch (error: any) {
    res.status(500).json({ error: { message: error.message } });
  }
});

// Get skill gaps
router.get('/skill-gaps', async (req, res) => {
  try {
    const { userId } = req.query;
    
    if (!userId) {
      return res.status(400).json({ error: { message: 'User ID is required' } });
    }

    const { data, error } = await supabase
      .from('skill_gaps')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(400).json({ error: { message: error.message } });
    }

    res.status(200).json({ data });
  } catch (error: any) {
    res.status(500).json({ error: { message: error.message } });
  }
});

export { router as careerRouter };
