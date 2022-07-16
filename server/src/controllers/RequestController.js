const RequestIssue = require('../models/RequestIssue');
const User = require('../models/User');

module.exports = { 
  formRequest: async(req, res) => {
    const checkUser = await User.findById(req.user.id);
    if (checkUser.userType == 'user') {
      const { isAnonymous, requestContent, categoryID } = req.body;
      try {
        if (isAnonymous === true) {
          const newRequest = await new RequestIssue({
            requestContent,
            isAnonymous,
            userID: [],
            categoryID: req.body.categoryID,
          });
          await newRequest.save();
          return res.status(200).json({
            message: 'Request has been sent',
            data: newRequest
          });
        } else {
          const newRequest = await new RequestIssue({
            requestContent,
            isAnonymous,
            userID: req.user.id,
            categoryID: req.body.categoryID,
          });
          await newRequest.save();
          return res.status(200).json({
            message: 'Request has been sent with anonymous',
            data: newRequest
          });
        }
      } catch (err) {
        res.status(500).json(err);
      }
    } else {
      res.status(401).json({ message: 'Only the user can post the request' });
    }
  }
}