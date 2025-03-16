
const express = require('express');
const deliveryController  = require ("../controllers/deliveryController")

const router = express.Router();

router.post('/register', deliveryController.deliveryRegister);
router.post('/login', deliveryController.deliveryLogin);

module.exports = router;
