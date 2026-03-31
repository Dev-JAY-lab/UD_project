const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const Blog = require('../models/Blog');

// @route   GET api/users/profile/:id
// @desc    Get user profile and their blogs
router.get('/profile/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ msg: 'User not found' });

    const blogs = await Blog.find({ author: req.params.id }).sort({ createdAt: -1 });
    res.json({ user, blogs });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/users/me
// @desc    Get current user
router.get('/me', auth, async (req, res) => {
    try {
      const user = await User.findById(req.user.id).select('-password');
      res.json(user);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
});

// @route   PUT api/users/me
// @desc    Update current user profile
router.put('/me', auth, async (req, res) => {
    const { username, bio, instagramLink } = req.body;
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        
        if (username) user.username = username;
        if (bio !== undefined) user.bio = bio;
        if (instagramLink !== undefined) user.instagramLink = instagramLink;

        await user.save();
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
