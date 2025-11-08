const express = require('express');
const router = express.Router();
const userRoutes = require('./userRoutes');

router.use('/users', userRoutes);

// A simple test route
router.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Uniflow API!' });
});

module.exports = router;
