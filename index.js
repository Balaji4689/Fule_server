
const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require('cors');

const customerRouter = require('./routes/customerRouter');
const vendorRouter = require('./routes/vendorRouter');
const firmRouter = require('./routes/firmRoutes');
const productRoutes = require('./routes/productRouter')
const deliveryRouter = require('./routes/deliveryRouter')



const app = express();
const port = process.env.PORT ||5001;

dotenv.config();
app.use(express.json());
app.use(cors()); 

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected successfully!"))
    .catch((error) => console.log("MongoDB connection error:", error));

app.use('/customer', customerRouter);
app.use('/vendor', vendorRouter);
app.use('/firm', firmRouter);
app.use('/product' ,productRoutes)
app.use('/delivery' ,deliveryRouter)
app.use('/uploads' ,express.static('uploads'));



app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
