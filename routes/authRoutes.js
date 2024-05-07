'use strict';

//Införskaffa router från express
const { Router } = require('express');
const router = Router();
//Införskaffa middleware-funktioner
const authController = require('../controllers/authController');

//Routes
router.post('/signup', authController.registerUser);
router.post('/login', authController.login);

//exportera
module.exports = router;
