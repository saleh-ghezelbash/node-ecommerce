const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
// const expressValidator = require('express-validator');
require('dotenv').config();

const authRoutes = require('./routes/authRoute')
const userRoutes = require('./routes/userRoute')
const categoryRoute = require('./routes/categoryRoute')
const productRoute = require('./routes/productRoute')
const orderRoute = require('./routes/orderRoute')

// function myValidator(expressValidator) {
//     return (req,res,next)=>{
//         return next(expressValidator)
//     }
// }

const app = express();
mongoose.connect(process.env.DATABASE,{useNewUrlParser:true})
.then(() => console.log('Connected to database'))
.catch(err => console.log('Something went wrong with connecting to database!!!',err))

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cookieParser());
// app.use(myValidator(expressValidator));
app.use(cors());

app.use('/api',authRoutes);
app.use('/api',userRoutes);
app.use('/api',categoryRoute);
app.use('/api',productRoute);
app.use('/api',orderRoute);

const port = process.env.PORT || 8000;
app.listen(port,console.log(`Server is running on port ${port}`))