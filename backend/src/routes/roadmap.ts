import { Router } from 'express';
import { supabase } from '../lib/supabase';

const router = Router();

// Get learning roadmaps
router.get('/', async (req, res) => {
  try {
    const { userId } = req.query;
    
    if (!userId) {
      return res.status(400).json({ error: { message: 'User ID is required' } });
    }

    const { data, error } = await supabase
      .from('learning_roadmaps')
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

// Create new learning roadmap
router.post('/', async (req, res) => {
  try {
    const { userId, title, targetRole, description } = req.body;
    
    if (!userId || !title) {
      return res.status(400).json({ error: { message: 'User ID and title are required' } });
    }

    const { data, error } = await supabase
      .from('learning_roadmaps')
      .insert({
        user_id: userId,
        title,
        target_role: targetRole,
        description,
        is_active: true
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

// Get roadmap items
router.get('/:id/items', async (req, res) => {
  try {
    const { id } = req.params;
    
    const { data, error } = await supabase
      .from('roadmap_items')
      .select('*')
      .eq('roadmap_id', id)
      .order('order_index', { ascending: true });

    if (error) {
      return res.status(400).json({ error: { message: error.message } });
    }

    res.status(200).json({ data });
  } catch (error: any) {
    res.status(500).json({ error: { message: error.message } });
  }
});

// Add roadmap items
router.post('/:id/items', async (req, res) => {
  try {
    const { id } = req.params;
    const { items } = req.body;
    
    if (!items || !Array.isArray(items)) {
      return res.status(400).json({ error: { message: 'Items array is required' } });
    }

    const roadmapItems = items.map((item, index) => ({
      roadmap_id: id,
      title: item.title,
      description: item.description,
      resource_type: item.resource_type,
      resource_url: item.resource_url,
      estimated_duration: item.estimated_duration,
      order_index: index,
      is_completed: false
    }));

    const { data, error } = await supabase
      .from('roadmap_items')
      .insert(roadmapItems)
      .select();

    if (error) {
      return res.status(400).json({ error: { message: error.message } });
    }

    res.status(201).json({ data });
  } catch (error: any) {
    res.status(500).json({ error: { message: error.message } });
  }
});

// Update roadmap item completion
router.put('/items/:itemId', async (req, res) => {
  try {
    const { itemId } = req.params;
    const { is_completed } = req.body;
    
    const { data, error } = await supabase
      .from('roadmap_items')
      .update({ is_completed })
      .eq('id', itemId)
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

export { router as roadmapRouter };
