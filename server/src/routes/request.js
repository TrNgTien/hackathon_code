const express = require('express');
const router = express.Router();

const { Authentication } = require('../middlewares/Authentication');
const { formRequest } = require('../controllers/RequestController');

router.post('/', Authentication, formRequest);

module.exports = router;