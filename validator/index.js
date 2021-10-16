// const { body,validationResult } = require('express-validator');

exports.userSignupValidator = function(req,res,next) {
    // console.log('req::',req);
    req.body('name','name cant be empty').notEmpty();
    req.body('email').isEmail();

    const errors = req.validationResult();
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    next();
}