const express = require('express');

const {userById,read,update,purchaseHistory} = require('../controllers/userController');
const {requireSignin,isAuth,isAdmin} = require('../controllers/authController');

const router = express.Router();

router.get('/secret/:userId',requireSignin,isAuth,isAdmin,(req,res) => {
    res.json({
       user: req.profile
    })
});

router.get('/orders/by/user/:userId',requireSignin,purchaseHistory);
router.get('/user/:userId',requireSignin,isAuth,read);
router.put('/user/:userId',requireSignin,isAuth,update);

router.param("userId",userById);


module.exports = router;