const Category = require('../models/categoryModel');

exports.categoryById = function(req,res,next,id) {
    Category.findById(id).exec((err,category) => {
      if(err || !category){
          return res.status(400).json({
              error:"category not found!"
          })
      }
      req.category = category;
      next();
    })
    
}

exports.list = function(req,res) {
    Category.find().exec((err,data) => {
      if(err){
          return res.status(400).json({
              error:err
          })
      }
      return res.json(data);
    })
    
}

exports.read = function(req,res) {
    req.category.photo = undefined;
    return res.json(req.category);
  }

exports.create = function(req,res) {
    const category = new Category(req.body);
    category.save((err,category) => {
        if(err){
            return res.status(400).json({
                err
            })
        }

        res.json({
            category
        })
    })
}

exports.remove = function(req,res) {
    let category = req.category;
    category.remove((err,data) => {
       if(err){
           return res.status(400).json({
               message:"Something went wrong with removing category!!!",
               error:err
           })
       }
        return res.json('ok');
    })
     
}

exports.update = function(req,res) {
    let category = req.category;
    category.name = req.body.name;
    category.save((err,data) => {
       if(err){
           return res.status(400).json({
               message:"Something went wrong for updating this category!",
               error:err
           })
       }
        return res.json(data);
    })
     
}