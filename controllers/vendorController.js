
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Vendor = require("../models/Vendor");
const dotEnv = require("dotenv")

dotEnv.config()

const secretKey = process.env.WhatIsYourName

const vendorRegister = async(req, res)=>{
    const {username , email ,password  } = req.body;

    try {
        console.log("Received Data:",req.body);
        if(!username || !email || !password ){
            return res.status(500).json({error:"All fields are required !!"});
        }
        const existingVendor = await Vendor.findOne({email});
        if (existingVendor) {
            return res.status(400).json({error:"email already exist"});
        }

        const hashedPassword = await bcrypt.hash(password , 10);
        const newVendor = new Vendor({
            username,
            email,
            password:hashedPassword
        });

        await newVendor.save()
        res.status(200).json({message:"Vendor registered successfully!!!"});
        console.log("Vendor registered successfully!"); 


    } catch (error) {
        console.error("Error during vendor registration:", error);
        res.status(500).json({error:"internal server error"})
    }

};

const vendorLogin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const vendor = await Vendor.findOne({ email });
        if (!vendor || !(await bcrypt.compare(password, vendor.password))) {
            return res.status(401).json({ error: "Invalid username or password" });
        }

        const token = jwt.sign({ vendorId: vendor._id }, secretKey, { expiresIn: "12h" });

        res.status(200).json({ 
            message: "Login successful!", 
            token, 
            vendor: { username: vendor.username }  
        });

        console.log("Generated Token:", token);
    } catch (error) {
        console.error("Error during vendor login:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};




module.exports= {vendorRegister , vendorLogin }