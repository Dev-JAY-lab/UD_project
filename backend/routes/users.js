const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const Blog = require('../models/Blog');
const multer = require("multer");
const path = require("path");

// Multer Storage Configuration for Profile Pictures
const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => {
    cb(null, "profile-" + req.user.id + "-" + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit for profile pics
  fileFilter: (req, file, cb) => {
    const allowedMimes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only JPEG, PNG, WEBP and GIF images are allowed"));
    }
  },
});

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
router.put('/me', [auth, upload.single('profilePic')], async (req, res) => {
    const { username, bio, instagramLink } = req.body;
    const profilePic = req.file ? `/uploads/${req.file.filename}` : undefined;

    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        
        if (username) user.username = username;
        if (bio !== undefined) user.bio = bio;
        if (instagramLink !== undefined) user.instagramLink = instagramLink;
        if (profilePic) user.profilePic = profilePic;

        await user.save();
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
