const express = require('express');
const router = express.Router();

const { createPost, updatePost, deletePost, getPost, getPosts } = require('../controllers/PostController');

router.post('/create', createPost);
router.post('/updatePost/:id', updatePost);
router.post('/deletePost/:id', deletePost);
router.post('/getPost/:id', getPost);
router.post('/getAllPosts', getPosts);


module.exports = router;