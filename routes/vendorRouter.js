
const express = require("express");
const vendorControllers = require("../controllers/vendorController");

const router = express.Router();

router.post('/register' ,vendorControllers.vendorRegister);
router.post('/login' ,vendorControllers.vendorLogin);



module.exports = router;
