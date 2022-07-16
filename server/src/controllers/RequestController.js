const RequestIssue = require('../models/RequestIssue');

module.exports = { 
  formRequest: async(req, res) => {
    const newRequest = new RequestIssue(req.body);
    try {
      const savedRequest = await newRequest.save();
      res.status(201).json(savedRequest);
    } catch (err) {
      res.status(500).json(err);
    }
  }
};