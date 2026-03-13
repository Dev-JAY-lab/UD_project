const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Blog = require('../models/Blog');
const User = require('../models/User');
const multer = require('multer');
const path = require('path');

// Multer Storage Configuration
const storage = multer.diskStorage({
    destination: './uploads/',
    filename: (req, file, cb) => {
        cb(null, 'blog-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

// @route   GET api/blogs
// @desc    Get all blogs
router.get('/', async (req, res) => {
    try {
      const blogs = await Blog.find().populate('author', 'username profilePic').sort({ createdAt: -1 });
      res.json(blogs);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
});
  
// @route   POST api/blogs
// @desc    Create a blog
router.post('/', [auth, upload.single('image')], async (req, res) => {
  const { title, content, topic } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : '';

  try {
    const newBlog = new Blog({
      title,
      content,
      image,
      topic: topic || 'General',
      author: req.user.id
    });

    let blog = await newBlog.save();
    // Return with populated author for immediate UI update if needed
    blog = await Blog.findById(blog._id).populate('author', 'username profilePic');
    res.json(blog);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/blogs/like/:id
// @desc    Like a blog
router.put('/like/:id', auth, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    // Check if the blog has already been liked by this user
    if (blog.likes.filter(like => like.toString() === req.user.id).length > 0) {
      // Unlike
      const removeIndex = blog.likes.map(like => like.toString()).indexOf(req.user.id);
      blog.likes.splice(removeIndex, 1);
    } else {
      // Like
      blog.likes.unshift(req.user.id);
    }

    await blog.save();
    res.json(blog.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/blogs/comment/:id
// @desc    Comment on a blog
router.post('/comment/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    const blog = await Blog.findById(req.params.id);

    const newComment = {
      text: req.body.text,
      user: req.user.id
    };

    blog.comments.unshift(newComment);
    await blog.save();
    
    const updatedBlog = await Blog.findById(req.params.id).populate('comments.user', 'username');
    res.json(updatedBlog.comments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/blogs/save/:id
// @desc    Save a blog
router.put('/save/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const blog = await Blog.findById(req.params.id);

    if (user.savedBlogs.includes(req.params.id)) {
      // Unsave
      user.savedBlogs = user.savedBlogs.filter(id => id.toString() !== req.params.id);
      blog.saves -= 1;
    } else {
      // Save
      user.savedBlogs.push(req.params.id);
      blog.saves += 1;
    }

    await user.save();
    await blog.save();
    res.json(user.savedBlogs);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
