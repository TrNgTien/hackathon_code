const express = require('express');
const router = express.Router();

const { createPost, updatePost, deletePost, getPost, getPosts } = require('../controllers/PostController');

router.post('/create', createPost);
router.post('/update/:id', updatePost);
router.post('/delete/:id', deletePost);
router.post('/getPost/:id', getPost);
router.post('/getAllPosts', getPosts);


module.exports = router;