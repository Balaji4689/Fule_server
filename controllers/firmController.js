const mongoose = require("mongoose");
const Firm = require("../models/Firm") 
const Vendor = require("../models/Vendor");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/"); 
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage: storage });

const addFirm = async (req, res) => {
    try {

        console.log("Request Body:", req.body);
        console.log("Request File:", req.file);

        const firmName = req.body.firmName;
        const area = req.body.area;
        const category = req.body.category ? req.body.category.split(",") : [];
        const offer = req.body.offer;
        const image = req.file ? req.file.filename : undefined;

        if (!firmName || !area) {
            return res.status(400).json({ message: "firmName and area are required!" });
        }

        console.log("Vendor ID:", req.vendorId);
        const vendor = await Vendor.findById(req.vendorId);
        console.log("Vendor Found:", vendor);
        if (!vendor) {
            return res.status(404).json({ message: "Vendor not found" });
        }

        const newFirm = new Firm({
            firmName,
            area,
            category,
            offer,
            image,
            vendor: vendor._id,
        });

        const savedFirm = await newFirm.save();
        vendor.firm.push(savedFirm._id);
        await vendor.save();

        return res.status(201).json({
            message: "Firm added successfully!",
            firm: savedFirm,
        });

    } catch (error) {
        console.error("Error adding firm:", error);
        console.error(error.stack);  
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

const deleteFirmById = async (req, res) => {
    try {
        const firmId = req.params.id;

        const deletedFirm = await Firm.findByIdAndDelete(firmId);
        if (!deletedFirm) {
            return res.status(401).json({ error: "Firm not found" });
        }

        res.status(200).json({ message: "Firm deleted successfully" });
    } catch (error) {
        console.error("Error deleting firm:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};


module.exports = {
    addFirm: [upload.single("image"), addFirm], 
    deleteFirmById,
};
