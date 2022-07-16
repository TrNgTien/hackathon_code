const express = require('express');
const router = express.Router();

const { register, login, google, verifyEmail, forgotPassword, resetPassword } = require('../controllers/AuthController');

router.post('/register', register);
router.post('/login', login);
router.post('/google', google);
router.get('/google', verifyEmail);
router.post('/forgotPass', forgotPassword);
router.post('/resetPass/:id', resetPassword);


module.exports = router;