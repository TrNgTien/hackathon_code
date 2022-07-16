const RequestIssue = require('../models/RequestIssue');

module.exports = { 
  formRequest: async(req, res) => {
    if (req.user.userType == 'user') {
      const newRequest = new RequestIssue(req.body);
      try {
        const savedRequest = await newRequest.save();
        res.status(201).json(savedRequest);
      } catch (err) {
        res.status(500).json(err);
      }
    } else {
      res.status(401).json({ message: 'Unauthorized' });
    }
  }
};