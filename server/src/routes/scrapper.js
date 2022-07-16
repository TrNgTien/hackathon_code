const express = require('express');
const router = express.Router();
const scrapperHandler = require('../controllers/ScrapperController');

router.get('/title', scrapperHandler.scrapTitle);

module.exports = router;