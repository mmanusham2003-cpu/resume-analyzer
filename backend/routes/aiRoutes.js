const express = require('express');
const router = express.Router();
const { getSuggestions, getJobMatch } = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

router.post('/suggestions/:id', protect, getSuggestions);
router.post('/match/:id', protect, getJobMatch);

module.exports = router;
