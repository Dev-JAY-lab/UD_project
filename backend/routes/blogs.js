const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Blog = require("../models/Blog");
const User = require("../models/User");
const multer = require("multer");
const path = require("path");
const {
  validateBlogCreate,
  validateComment,
} = require("../middleware/validation");
const { blogLimiter, commentLimiter } = require("../middleware/rateLimiter");

// Multer Storage Configuration with size limit
const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => {
    cb(null, "blog-" + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedMimes = ["image/jpeg", "image/png", "image/gif"];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only JPEG, PNG, and GIF images are allowed"));
    }
  },
});

// @route   GET api/blogs
// @desc    Get all blogs
router.get("/", async (req, res) => {
  try {
    const blogs = await Blog.find()
      .populate("author", "username profilePic")
      .populate("comments.user", "username")
      .sort({ createdAt: -1 });
    res.json(blogs);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Server Error" });
  }
});

// @route   POST api/blogs
// @desc    Create a blog
router.post(
  "/",
  [auth, blogLimiter, upload.single("image"), validateBlogCreate],
  async (req, res) => {
    const { title, content, topic } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : "";

    try {
      const newBlog = new Blog({
        title,
        content,
        image,
        topic: topic || "General",
        author: req.user.id,
      });

      let blog = await newBlog.save();
      blog = await Blog.findById(blog._id).populate(
        "author",
        "username profilePic",
      );
      res.status(201).json(blog);
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: "Server Error" });
    }
  },
);

// @route   PUT api/blogs/like/:id
// @desc    Like a blog
router.put("/like/:id", auth, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ msg: "Blog not found" });
    }

    if (
      blog.likes.filter((like) => like.toString() === req.user.id).length > 0
    ) {
      const removeIndex = blog.likes
        .map((like) => like.toString())
        .indexOf(req.user.id);
      blog.likes.splice(removeIndex, 1);
    } else {
      blog.likes.unshift(req.user.id);
    }

    await blog.save();
    res.json(blog.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Server Error" });
  }
});

// @route   POST api/blogs/comment/:id
// @desc    Comment on a blog
router.post(
  "/comment/:id",
  [auth, commentLimiter, validateComment],
  async (req, res) => {
    try {
      const blog = await Blog.findById(req.params.id);

      if (!blog) {
        return res.status(404).json({ msg: "Blog not found" });
      }

      const newComment = {
        text: req.body.text,
        user: req.user.id,
      };

      blog.comments.unshift(newComment);
      await blog.save();

      const updatedBlog = await Blog.findById(req.params.id).populate(
        "comments.user",
        "username",
      );
      res.status(201).json(updatedBlog.comments);
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: "Server Error" });
    }
  },
);

// @route   PUT api/blogs/save/:id
// @desc    Save a blog
router.put("/save/:id", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ msg: "Blog not found" });
    }

    if (user.savedBlogs.includes(req.params.id)) {
      user.savedBlogs = user.savedBlogs.filter(
        (id) => id.toString() !== req.params.id,
      );
      blog.saves -= 1;
    } else {
      user.savedBlogs.push(req.params.id);
      blog.saves += 1;
    }

    await user.save();
    await blog.save();
    res.json(user.savedBlogs);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Server Error" });
  }
});

// @route   PUT api/blogs/:id
// @desc    Update a blog (title and content)
router.put("/:id", auth, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ msg: "Blog not found" });
    }
    if (blog.author.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not authorized" });
    }

    const { title, content } = req.body;
    if (title) blog.title = title;
    if (content) blog.content = content;

    await blog.save();
    res.json(blog);
  } catch (err) {
    if (err.kind === 'ObjectId') return res.status(404).json({ msg: "Blog not found" });
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   DELETE api/blogs/:id
// @desc    Delete a blog
router.delete("/:id", auth, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ msg: "Blog not found" });
    }
    if (blog.author.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not authorized" });
    }

    await blog.deleteOne();
    res.json({ msg: "Blog removed" });
  } catch (err) {
    if (err.kind === 'ObjectId') return res.status(404).json({ msg: "Blog not found" });
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
