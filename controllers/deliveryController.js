const Delivery = require('../models/Delivery');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();
const secretKey = process.env.WhatIsYourName;

const deliveryRegister = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        console.log("Received Data:", req.body);

        if (!username || !email || !password) {
            return res.status(400).json({ error: "All fields are required!" });
        }

        const existingDeliveryPerson = await Delivery.findOne({ email });
        if (existingDeliveryPerson) {
            return res.status(400).json({ error: "Email already exists!" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newDeliveryPerson = new Delivery({
            username,
            email,
            password: hashedPassword
        });

        await newDeliveryPerson.save();
        res.status(201).json({ message: "Delivery person registered successfully!!!" });
        console.log("Delivery person registered successfully!");  

    } catch (error) {
        console.error("Error during delivery person registration:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

const deliveryLogin = async (req, res) => {
    const { email, password } = req.body;
    
    try {
        const deliveryPerson = await Delivery.findOne({ email });
        if (!deliveryPerson || !(await bcrypt.compare(password, deliveryPerson.password))) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        const token = jwt.sign({ deliveryPersonId: deliveryPerson._id }, secretKey, { expiresIn: "1h" });

        res.status(200).json({
            success: "Login successful!",
            token,
            deliveryPerson: {
                id: deliveryPerson._id,
                username: deliveryPerson.username,
                email: deliveryPerson.email
            }
        });

        console.log(email, "Token Generated:", token);
    } catch (error) {
        console.error("Error during delivery login:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = { deliveryRegister, deliveryLogin };
