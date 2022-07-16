const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const User = require('../models/User');

const register = async (req, res) => {
  try {
    const { userName, password, userAvatar, userCover, biography, gender, firstName, lastName, DOB } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const newUser = new User({
      userName,
      password: hashedPassword,
      userAvatar,
      userCover,
      biography,
      gender,
      firstName,
      lastName,
      DOB,
    });
    const user = await newUser.save();
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err)
  }
}

const login = async (req, res) => {
  try {
    const { userName, password } = req.body;
    const user = await User.findOne({ userName });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Incorrect password' });
    }
    const payload = { id: user._id, userName: user.userName };
    const accessToken = jwt.sign(payload, 'mentalWeb', {expiresIn: '1h'});
    res.status(200).json({ user , accessToken });
  } catch (err) {
    res.status(500).json(err)
  }
}

module.exports = { register, login };