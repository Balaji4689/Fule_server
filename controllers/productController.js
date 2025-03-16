const Product = require('../models/Product');
const Firm = require('../models/Firm');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

const addProduct = async (req, res) => {
    try {
        const { productName, price, category } = req.body;
        const image = req.file ? req.file.filename : undefined;
        const firmId = req.params.firmId;

        const firm = await Firm.findById(firmId);
        if (!firm) {
            return res.status(404).json({ error: "No firm found" });
        }

        const product = new Product({
            productName,
            price,
            category,
            image,
            firm: firm._id
        });

        const savedProduct = await product.save();
        console.log("Product saved:", savedProduct);

        firm.products = firm.products || [];  
        firm.products.push(savedProduct._id);  
        await firm.save();
        console.log("Firm updated with product:", firm);

        res.status(201).json(savedProduct);
    } catch (error) {
        console.error("Error adding product:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};


const getProductByFirm = async (req, res) => {
    try {
        const firmId = req.params.firmId;
        console.log(`Firm ID received for fetching products: ${firmId}`);

        const firm = await Firm.findById(firmId).populate("products");
        if (!firm) {
            return res.status(404).json({ error: "No firm found" });
        }

        const restaurantName = firm.firmName;
        console.log("Firm found:", firm);
        const products = firm.products;  

        console.log("Products found:", products);

        if (!products.length) {
            return res.status(404).json({ message: "No products found for this firm" });
        }

        res.status(200).json({ restaurantName, products });
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};


const deleteProductById = async (req, res) => {
    try {
        const productId = req.params.id;

        const deletedProduct = await Product.findByIdAndDelete(productId);
        if (!deletedProduct) {
            return res.status(404).json({ error: "No product found" });
        }

        res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = { 
    addProduct: [upload.single('image'), addProduct], 
    getProductByFirm, 
    deleteProductById 
};
