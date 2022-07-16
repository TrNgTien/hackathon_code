const Post = require('../models/Post');

module.exports = { 
  createPost: async (req, res) => {
    if (req.user.role == 'expert') {
      const newPost = new Post(req.body);
      try {
        const savedPost = await newPost.save();
        res.status(201).json(savedPost);
      } catch (err) {
        res.status(500).json(err);
      }
    }
  },

  updatePost: async (req, res) => {
    if (req.user.id !== req.body.userID) {
      res.status(401).json({ message: 'You are not authorized to update this post' });
    } else {
      try {
        let post = await Post.findOne(req.params.id);
        const updatedPost = post.updateOne({ $push: { userID: req.user.id } })
          .then(post => {
            const userID = Post.findOne(req.params.id)
            res.status(200).json(post);
          })
        res.status(200).json(updatedPost);
      } catch (err) {
        res.status(500).json(err);
      }
    }
  },

  deletePost: async (req, res) => {
    try {
      const deletedPost = await Post.findByIdAndDelete(req.params.id);
      res.status(200).json(deletedPost);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  getPost: async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      res.status(200).json(post);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  getPosts: async (req, res) => {
    try {
      const posts = await Post.find();
      res.status(200).json(posts);
    } catch (err) {
      res.status(500).json(err);
    }
  }
}

