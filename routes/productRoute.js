const express = require('express');

const {create,productById,read,remove,update,list,listRelated,listCatgories,listBySearch,photo,listSearch} = require('../controllers/productController');
const {userById} = require('../controllers/userController');
const {requireSignin,isAuth,isAdmin} = require('../controllers/authController');


const router = express.Router();

router.get('/products', list);
router.get('/products/related/:productId', listRelated);
router.get('/products/categories', listCatgories);
router.get("/products/search", listSearch);
router.post("/products/by/search", listBySearch);
router.get("/product/photo/:productId", photo);
router.get('/product/:productId', read);
router.delete('/product/:productId/:userId',requireSignin,isAuth,isAdmin, remove);
router.put('/product/:productId/:userId',requireSignin,isAuth,isAdmin, update);
router.post('/product/create/:userId',requireSignin,isAuth,isAdmin, create);

router.param("userId",userById);
router.param("productId",productById);




module.exports = router;