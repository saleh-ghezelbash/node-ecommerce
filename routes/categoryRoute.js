const express = require('express');

const {create,categoryById,read,remove,update,list} = require('../controllers/categoryController');
const {userById} = require('../controllers/userController');
const {requireSignin,isAuth,isAdmin} = require('../controllers/authController');


const router = express.Router();

router.get('/categories', list);
router.get('/category/:categoryId', read);
router.delete('/category/:categoryId/:userId',requireSignin,isAuth,isAdmin, remove);
router.put('/category/:categoryId/:userId',requireSignin,isAuth,isAdmin, update);
router.post('/category/create/:userId',requireSignin,isAuth,isAdmin, create);
router.param("categoryId",categoryById);
router.param("userId",userById);




module.exports = router;