const express = require('express');
const router = express.Router();

const { commentRequest } = require('../controllers/CommentController');

router.post('/', commentRequest);


module.exports = router;