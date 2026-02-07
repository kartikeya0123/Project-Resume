import { Router } from 'express';
import { supabase } from '../lib/supabase';

const router = Router();

// Get user resumes
router.get('/', async (req, res) => {
  try {
    const { userId } = req.query;
    
    if (!userId) {
      return res.status(400).json({ error: { message: 'User ID is required' } });
    }

    const { data, error } = await supabase
      .from('resumes')
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

// Create new resume
router.post('/', async (req, res) => {
  try {
    const { userId, title, content } = req.body;
    
    if (!userId || !title || !content) {
      return res.status(400).json({ error: { message: 'User ID, title, and content are required' } });
    }

    const { data, error } = await supabase
      .from('resumes')
      .insert({
        user_id: userId,
        title,
        content,
        ats_score: Math.floor(Math.random() * 30) + 70, // Mock ATS score
        is_active: false
      })
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: { message: error.message } });
    }

    res.status(201).json({ data });
  } catch (error: any) {
    res.status(500).json({ error: { message: error.message } });
  }
});

// Update resume
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, is_active } = req.body;
    
    const { data, error } = await supabase
      .from('resumes')
      .update({
        title,
        content,
        is_active,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
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

// Delete resume
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const { error } = await supabase
      .from('resumes')
      .delete()
      .eq('id', id);

    if (error) {
      return res.status(400).json({ error: { message: error.message } });
    }

    res.status(200).json({ message: 'Resume deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: { message: error.message } });
  }
});

export { router as resumeRouter };
