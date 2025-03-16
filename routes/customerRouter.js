
const express = require("express");
const customerControllers = require("../controllers/customerController");

const router = express.Router();

router.post('/register', customerControllers.customerRegister);
router.post('/login', customerControllers.customerLogin);

module.exports = router;
