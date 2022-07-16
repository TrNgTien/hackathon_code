const express = require('express');
const router = express.Router();

const { commentPost } = require('../controllers/CommentController');

router.post('/', commentPost);


module.exports = router;