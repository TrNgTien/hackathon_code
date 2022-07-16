const express = require('express');
const router = express.Router();

const { updateUser } = require('../controllers/UserController');

router.post('/update/:userID', updateUser);

module.exports = router;