import { Router } from 'express';
import { supabase } from '../lib/supabase';

const router = Router();

// Get user profile
router.get('/profile', async (req, res) => {
  try {
    const { userId } = req.query;
    
    if (!userId) {
      return res.status(400).json({ error: { message: 'User ID is required' } });
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      return res.status(404).json({ error: { message: 'Profile not found' } });
    }

    res.status(200).json({ data });
  } catch (error: any) {
    res.status(500).json({ error: { message: error.message } });
  }
});

// Update user profile
router.put('/profile', async (req, res) => {
  try {
    const { userId, profileData } = req.body;
    
    if (!userId || !profileData) {
      return res.status(400).json({ error: { message: 'User ID and profile data are required' } });
    }

    const { data, error } = await supabase
      .from('profiles')
      .upsert({
        id: userId,
        ...profileData,
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: { message: error.message } });
    }

    res.status(200).json({ data });
  } catch (error: any) {
    res.status(500).json({ error: { message: error.message } });
  }
});

export { router as profileRouter };
