const mongoose = require('mongoose');



const categorySchema = new mongoose.Schema({
    name:{
        required:true,
        type:String,
        trim:true,
        maxLength: 32
    }
},{timestamps:true})




module.exports = mongoose.model('Category',categorySchema);