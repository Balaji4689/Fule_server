
const express = require("express");
const productController = require('../controllers/productController');
const { model } = require("mongoose");

const router = express.Router();
const path = require('path');
router.post('/add-product/:firmId' , productController.addProduct);
router.get('/:firmId/products', productController.getProductByFirm);

router.get('/uploads/:imageName' ,(req, res)=>{
    const imageName = req.params.imageName ;
    req.headersSend('content-Type', 'image/jpeg')
    res.sendFile(path.join(__dirname , '..' ,'uploads',imageName))
})

router.delete('/delete-product/:id', productController.deleteProductById);


module.exports= router;