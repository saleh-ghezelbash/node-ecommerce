const formidable = require('formidable');
const _ = require('lodash');
const fs = require('fs');
const Product = require('../models/productModel');

exports.productById = function (req, res, next, id) {
    Product.findById(id).exec((err, product) => {
        if (err || !product) {
            return res.status(400).json({
                error: "Product not found!"
            })
        }
        req.product = product;
        next();
    })

}

exports.read = function (req, res) {
    req.product.photo = undefined;
    return res.json(req.product);
}

exports.remove = function (req, res) {
    let product = req.product;
    product.remove((err, data) => {
        if (err) {
            return res.status(400).json({
                message: "Something went wrong!!!",
                error: err
            })
        }
        return res.json('ok');
    })

}

exports.create = function (req, res) {
    let form = formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: "Image could not be uploaded!"
            })
        }
        // console.log('fields:',fields);
        if (!fields.name || !fields.description || !fields.price || !fields.category || !fields.quantity || !files.photo) {
            return res.status(400).json({
                error: "All fields are requared!"
            })
        }
        let product = new Product(fields);
        if (files.photo) {
            if (files.photo.size > 1000000) {
                return res.status(400).json({
                    error: "Image size should be less than 1MB"
                })
            }
            product.photo.data = fs.readFileSync(files.photo.path);
            product.photo.contentType = files.photo.type;
        }
        product.save((err, product) => {
            if (err) {
                res.status(400).json({
                    err
                })
            }
            res.json({ product });
        })
    })


}

exports.update = function (req, res) {
    let form = formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: "Image could not be uploaded!"
            })
        }
        // console.log('fields::',fields);
        if (!fields.name || !fields.description || !fields.price || !fields.category || !fields.quantity || !files.photo) {
            return res.status(400).json({
                error: "All fields are requared!"
            })
        }

        let product = req.product;
        product = _.extend(product, fields);

        if (files.photo) {
            if (files.photo.size > 1000000) {
                return res.status(400).json({
                    error: "Image size should be less than 1MB"
                })
            }
            product.photo.data = fs.readFileSync(files.photo.path);
            product.photo.contentType = files.photo.type;
        }
        product.save((err, product) => {
            if (err) {
                res.status(400).json({
                    err
                })
            }
            res.json({ product });
        })
    })


}

exports.list = function (req, res) {
    let order = req.query.order ? req.query.order : 'asc';
    let sortBy = req.query.sortBy ? req.query.sortBy : '_id';
    let limit = req.query.limit ? parseInt(req.query.limit) : 6;

    Product.find().select('-photo').populate('category').sort([[sortBy, order]]).limit(limit)
        .exec((err, data) => {
            if (err) {
                return res.status(400).json({
                    error: "Products not found!"
                })
            }
            res.json(data);
        })
}

exports.listRelated = function (req, res) {
    let limit = req.query.limit ? parseInt(req.query.limit) : 6;

    Product.find({
        _id: { $ne: req.product },
        category: req.product.category
    })
        .populate('category', '_id name')
        .limit(limit)
        .exec((err, data) => {
            if (err) {
                return res.status(400).json({
                    error: "Products not found!"
                })
            }
            res.json(data);
        })
}

exports.listCatgories = function (req, res) {

    Product.distinct('category', {}, (err, category) => {
        if (err) {
            return res.status(400).json({
                error: "categories not found!"
            })
        }
        res.json(category);
    })
}



exports.listBySearch = (req, res) => {
    let order = req.body.order ? req.body.order : "desc";
    let sortBy = req.body.sortBy ? req.body.sortBy : "_id";
    let limit = req.body.limit ? parseInt(req.body.limit) : 100;
    let skip = req.body.skip ? parseInt(req.body.skip) : 0;
    let findArgs = {};


    for (let key in req.body.filters) {
        if (req.body.filters[key].length > 0) {
            if (key === "price") {

                findArgs[key] = {
                    $gte: req.body.filters[key][0],
                    $lte: req.body.filters[key][1]
                };
            } else {
                findArgs[key] = req.body.filters[key];
            }
        }
    }

    Product.find(findArgs)
        .select("-photo")
        .populate("category")
        .sort([[sortBy, order]])
        .skip(skip)
        .limit(limit)
        .exec((err, data) => {
            if (err) {
                return res.status(400).json({
                    message: "Products not found",
                    error: err
                });
            }
            res.json({
                size: data.length,
                data
            });
        });
};

exports.photo = (req, res, next) => {
    if (req.product.photo.data) {
        res.set('Content-type', req.product.photo.contentType);
        return res.send(req.product.photo.data);
    }
    next();
}

exports.listSearch = (req, res) => {
    const query = {};
    if (req.query.search) {
        query.name = { $regex: req.query.search, $options: 'i' };
        if (req.query.category && req.query.category != 'All') {
            query.category = req.query.category;
        }
        Product.find(query, (err, data) => {
            if (err) {
                return res.status(400).json({
                    message: "Products not found",
                    error: err
                });
            }
            res.json({
                size: data.length,
                data
            });
        }).select('-photo');
    }
}

exports.decreaseQuantity = (req, res, next) => {
    let bulks = req.body.order.products.map(item => {
        return {
            updateOne: {
                filter: { _id: item._id },
                update: { $inc: { quantity: -item.count, sold: +item.count } }
            }
        }
    });
    Product.bulkWrite(bulks,{},(err,data) => {
        if (err) {
            return res.status(400).json({
                message: "Could not update product!",
                error: err
            });
        }
        next();
    })
}
