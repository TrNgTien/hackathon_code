const Comment = require('../models/Comment');

module.exports = { 
  commentRequest: async(req, res) => {
    if (req.user.userType == 'expert') {
      const newComment = new Comment(req.body);
      try {
        const savedComment = await newComment.save();
        res.status(201).json(savedComment);
      } catch (err) {
        res.status(500).json(err);
      }
    } else {
      res.status(401).json({ message: 'You are not authorized to comment' });
    }
  }
};