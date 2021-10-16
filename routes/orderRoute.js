const express = require('express');

const {create,listOrders,getStatusValues,updateOrderStatus,orderById} = require('../controllers/orderController');
const {userById,addOrderToUserHistory} = require('../controllers/userController');
const {requireSignin,isAuth, isAdmin} = require('../controllers/authController');
const {productById,decreaseQuantity} = require('../controllers/productController');


const router = express.Router();


router.get('/order/list/:userId',requireSignin,isAuth,isAdmin, listOrders);
router.get('/order/status-values/:userId',requireSignin,isAuth,isAdmin, getStatusValues);
router.put('/order/:orderId/:userId',requireSignin,isAuth,isAdmin, updateOrderStatus);
router.post('/order/create/:userId',requireSignin,isAuth,addOrderToUserHistory,decreaseQuantity, create);

router.param("userId",userById);
router.param("productId",productById);
router.param("orderId",orderById);




module.exports = router;