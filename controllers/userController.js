const { Order } = require('../models/orderModel');
const User = require('../models/userModel');


exports.userById = function (req, res, next, id) {
  // console.log('body:',req.body);
  User.findById(id).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "user not found!"
      })
    }
    req.profile = user;
    next();
  })

}

exports.read = (req, res) => {
  req.profile.hashed_password = undefined;
  req.profile.salt = undefined;
  return res.json(req.profile);
}

exports.update = (req, res) => {
  User.findByIdAndUpdate({ _id: req.profile._id }, { $set: req.body }, { new: true }, (err, user) => {
    if (err || !user) {
      return res.status(400).json({
        message: "user not found!",
        error: err
      })
    }
    user.hashed_password = undefined;
    user.salt = undefined;
    res.json(user);
  })
}

exports.addOrderToUserHistory = (req, res, next) => {
  let history = [];
  req.body.order.products.forEach(item => {
    history.push({
      _id: item._id,
      name: item.name,
      quantity: item.count,
      description: item.description,
      category: item.category,
      transaction_id: req.body.order.transaction_id,
      amount: req.body.order.amount
    })
  });

  User.findByIdAndUpdate({ _id: req.profile._id }, { $push: { history } }, { new: true }, (err, data) => {
    if (err) {
      return res.status(400).json({
        message: "could not update user purchase history!",
        error: err
      })
    }
    next();
  })
}

exports.purchaseHistory = (req, res) => {
  Order.find({ user: req.profile._id }).populate('user', '_id name').exec((err, data) => {
    if (err) {
      return res.status(400).json({
        error: err
      })
    }
    res.json(data)
  })
}
