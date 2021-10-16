const { Order } = require("../models/orderModel");


exports.orderById =  function (req, res, next, id) {
    Order.findById(id).populate('products.product','name price').exec((err, order) => {
        if (err || !order) {
            return res.status(400).json({
                error: "order not found!"
            })
        }
        req.order = order;
        next();
    })

}

exports.create = (req,res) => {
    req.body.order.user = req.profile;
    const order = new Order(req.body.order);
    order.save((err,data) => {
        if(err){
            return res.status(400).json({
                error:err
            })
        }
        res.json(data);
    })
}

exports.listOrders = (req,res) => {
    Order.find().populate('user','_id name address').sort('-created').exec((err,data) => {
        if(err){
            return res.status(400).json({
                error:err
            })
        }
        res.json(data);
    })
}

exports.getStatusValues = (req,res) => {
    res.json(Order.schema.path('status').enumValues);
}

exports.updateOrderStatus = (req,res) => {
    Order.update({_id:req.body.orderId},{$set:{status:req.body.status}},(err,data)=>{
        if(err){
            return res.status(400).json({
                error:err
            })
        }
        res.json(data);
    })
}