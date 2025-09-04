const express = require('express');
const router = express.Router();

// Track trivia game actions
router.post('/track', async (req, res) => {
  try {
    const { action, data } = req.body;
    
    console.log('Trivia tracking:', { action, data });
    
    // For now, just log the tracking data
    // You can add database logging here later
    
    res.status(200).json({ 
      success: true, 
      message: 'Tracking data received',
      action,
      data 
    });
    
  } catch (error) {
    console.error('Error tracking trivia:', error);
    res.status(500).json({ 
      error: 'Failed to track trivia data' 
    });
  }
});

module.exports = router;
