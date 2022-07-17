const Post = require("../models/Post");
const Category = require("../models/Category");
const User = require('../models/User');
const cloudinary = require("../config/cloudinary");

module.exports = {
  createPost: async (req, res) => {
    try {
      if (req.user.userType == "expert") {
        const { categories, description, postImg } = req.body;
        let categoriesArr = [];
        for (let i = 0; i <= categories.length; i++) {
          let category = Category.find(categories[i]);
          categoriesArr.push(category);
        }
        if (!postImg) {
          let newPost = new Post({
            description: description,
            categories: categoriesArr,
          });
          const savedPost = await newPost.save();
          res.status(201).json(savedPost);
        } else {
          let uploadResponse = await cloudinary.uploader.upload(postImg, {
            resource_type: "img",
          });
          let imgURL = uploadResponse.secure_url;
          let imgPublicID = uploadResponse.public_id;
          let newPost = new Post({
            description: description,
            postImg: {
              imgURL: imgURL,
              imgPublicID: imgPublicID,
            },
            categories: categoriesArr,
          });
          const savedPost = await newPost.save();
          res.status(201).json(savedPost);
        }
      } else {
        res
          .status(403)
          .json({ message: "You are not authorized to create a post" });
      }
    } catch (err) {
      res.status(500).json(err);
    }
  },

  updatePost: async (req, res) => {
    const { postID } = req.params;
    let post = Post.findOne({ _id: postID });
    if (req.user.id !== post.authorID) {
      res
        .status(401)
        .json({ message: "You are not authorized to update this post" });
    } else {
      try {
        let post = await Post.findOne({ _id: postID });
        if (
          !post.userUpVoteID.includes(req.user.id) &&
          post.userDownVoteID.includes(req.user.id)
        ) {
          await post.updateOne({ $push: { userUpVoteID: req.user.id } });
          await post.updateOne({ numberUp: numberUp + 1 });
          await post.updateOne({ $pull: { userDownVoteID: req.user.id } });
          await post.updateOne({ numberDown: numberDown - 1 });
          res.status(200).json({
            message: "upvote successfully!!!",
          });
        } else if (
          !post.userDownVoteID.includes(req.user.id) &&
          post.userUpVoteID.includes(req.user.id)
        ) {
          await post.updateOne({ $push: { userDownVoteID: req.user.id } });
          await post.updateOne({ numberUp: numberDown + 1 });
          await post.updateOne({ $pull: { userUpVoteID: req.user.id } });
          await post.updateOne({ numberDown: numberUp - 1 });
          res.status(200).json({
            message: "downvote successfully!!!",
          });
        } else if (post.userUpVoteID.includes(req.user.id)) {
          await post.updateOne({ $pull: { userUpVoteID: req.user.id } });
          await post.updateOne({ numberDown: numberUp - 1 });
          res.status(200).json({
            message: "unupvote successfully",
          });
        } else {
          await post.updateOne({ $pull: { userDownVoteID: req.user.id } });
          await post.updateOne({ numberDown: numberDown - 1 });
          res.status(200).json({
            message: "undownvote successfully",
          });
        }
      } catch (err) {
        res.status(500).json(err);
      }
    }
  },

  deletePost: async (req, res) => {
    if (req.user.userType == "expert") {
      try {
        const deletedPost = await Post.findByIdAndDelete(req.params.id);
        res.status(200).json(deletedPost);
      } catch (err) {
        res.status(500).json(err);
      }
    } else {
      res
        .status(403)
        .json({ message: "You are not authorized to create a post" });
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
  },
  savePost: async (req, res) => {
    try {
      const {postID} = req.params;
      let user = User.findOne({_id: req.user.id});
      if(!user.savedPost.includes(postID)){
        await user.updateOne({$push: {savedPost: postID}});
        return res.status(200).json({
          message: 'Save post successfully!!!'
        })
      }
      else {
        await user.updateOne({$pull: {savedPost: postID}});
        return res.status(200).json({
          message: 'Unsave post successfully!!!'
        })
      }
    } catch (err) {
      res.status(500).json(err);
    }
  },
};
