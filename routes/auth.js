const express = require('express');

const authController = require('../controllers/auth');

const router = express.Router();

router.post('/login', authController.login);

router.post('/token', authController.token);

router.get('/refresh', authController.refresh);


module.exports = router;