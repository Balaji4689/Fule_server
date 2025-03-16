const Customer = require('../models/Customer'); 
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();
const secretKey = process.env.WhatIsYourName; 

const customerRegister = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        console.log("Received Data:", req.body);

        if (!username || !email || !password) {
            return res.status(400).json({ error: "All fields are required!" });
        }

        const existingCustomer = await Customer.findOne({ email });
        if (existingCustomer) {
            return res.status(400).json({ error: "Email already exists!" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newCustomer = new Customer({
            username,
            email,
            password: hashedPassword
        });

        await newCustomer.save();
        res.status(201).json({ message: "Customer registered successfully!!!" });
        console.log("Customer registered successfully!");  

    } catch (error) {
        console.error("Error during customer registration:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};


const customerLogin = async (req, res) => {
    const { email, password } = req.body;
    
    try {
        const customer = await Customer.findOne({ email });
        if (!customer || !(await bcrypt.compare(password, customer.password))) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        const token = jwt.sign({ customerId: customer._id }, secretKey, { expiresIn: "1h" });

        res.status(200).json({
            success: "Login successful!",
            token,
            customer: {
                id: customer._id,
                username: customer.username,
                email: customer.email
            }
        });

        console.log(email, "Token Generated:", token);
    } catch (error) {
        console.error("Error during customer login:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = { customerRegister, customerLogin };



