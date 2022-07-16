const express = require('express');
const router = express.Router();

const { formRequest } = require('../controllers/RequestController');

router.post('/', formRequest);


module.exports = router;