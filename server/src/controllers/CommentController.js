const Comment = require('../models/Comment');

module.exports = { 
  commentPost: async(req, res) => {
    const newComment = new Comment(req.body);
    try {
      const savedComment = await newComment.save();
      res.status(201).json(savedComment);
    } catch (err) {
      res.status(500).json(err);
    }
  }
};