const User = require('../models/User');

module.exports = { 
  updateUser: async(req, res) => {
    if (req.user.id !== req.body.userID) {
      res.status(401).json({ message: 'You are not authorized to update this user' });
    } else {
      try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
        return res.status(200).json(updatedUser);
      } catch (err) {
        res.status(500).json(err);
      }
    }
  }
};