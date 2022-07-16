const Comment = require('../models/Comment');
const Post = require('../models/Post');

module.exports = { 
  commentPost: async(req, res) => {
    if (req.user.userType == 'expert') {
      try {
        const { commentContent } = req.body;
        const post = await Post.findOne({ _id: req.params.postID });
        const newComment = new Comment({
          commentContent,
          createdAt,
          userId: req.user.id,
          postId: req.params.postID,
        });
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