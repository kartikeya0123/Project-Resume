import { Router } from 'express';
import { supabase } from '../lib/supabase';

const router = Router();

// Simple auth check (in production, use proper JWT verification)
router.post('/verify', async (req, res) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      return res.status(400).json({ error: { message: 'Token is required' } });
    }

    // For now, we'll do a basic token validation
    // In production, verify JWT token with Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      return res.status(401).json({ error: { message: 'Invalid token' } });
    }

    res.status(200).json({ 
      data: { 
        user: {
          id: user.id,
          email: user.email,
          user_metadata: user.user_metadata
        }
      }
    });
  } catch (error: any) {
    res.status(500).json({ error: { message: error.message } });
  }
});

export { router as authRouter };
