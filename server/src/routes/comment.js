const express = require('express');
const router = express.Router();

const { Authentication } = require('../middlewares/Authentication');
const { commentPost } = require('../controllers/CommentController');

router.post('/:postID', Authentication, commentPost);

module.exports = router;