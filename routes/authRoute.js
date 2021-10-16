const express = require('express');

const {signup,signin,signout,requireSignin} = require('../controllers/authController');
// const {userSignupValidator} = require('../validator/index');

const router = express.Router();

router.post('/signup', signup);
router.post('/signin', signin);
router.get('/signout', signout);


module.exports = router;