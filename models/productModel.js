const mongoose = require('mongoose');


const productSchema = new mongoose.Schema({
    name:{
        required:true,
        type:String,
        trim:true,
        maxLength: 32
    },
    description:{
        required:true,
        type:String,
        trim:true,
        maxLength: 2000
    },
    price:{
        required:true,
        type:Number
    },
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Category",
        required:true
    },
    quantity:{
        type:Number
    },
    sold:{
        type:Number,
        default:0
    },
    photo:{
        data:Buffer,
        contentType:String
    },
    shipping:{
        type:Boolean,
        required:false
    }
},{timestamps:true})


module.exports = mongoose.model('Product',productSchema);