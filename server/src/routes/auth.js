const express = require('express');
const router = express.Router();

const { register, login, google, returnGoogle } = require('../controllers/AuthController');

router.post('/register', register);
router.post('/login', login);
router.post('/google', google);
router.get('/google', returnGoogle);

module.exports = router;