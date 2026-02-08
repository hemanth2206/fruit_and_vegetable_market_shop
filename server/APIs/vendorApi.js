const exp=require("express")
const vendorApp=exp();
const createBuyerOrVendor=require("./createBuyerOrVendor");
const Product=require("../models/productModel");
const Order=require("../models/orderModel");
const buyerVendorModel=require("../models/buyerVendorModel");
const {requireAuth,clerkMiddleware}=require("@clerk/express")
const expressAsyncHandler=require("express-async-handler");
require("dotenv").config();

vendorApp.use(clerkMiddleware());

vendorApp.get("/vendors",(req,res)=>{
    res.send({message:"from vendor api"});
});

vendorApp.get('/unauthorized', (req, res) => {
    res.status(401).send({ message: 'unauthourize request...plz login' });
});

vendorApp.post("/vendor",createBuyerOrVendor);

vendorApp.post("/product",async(req,res)=>{
    try {
        const newProductObj=req.body;
        
        // Validate vendorId is provided
        if(!newProductObj.vendorId) {
            return res.status(400).send({message:"VendorId is required"});
        }
        
        const newProduct=new Product(newProductObj);
        const productObj=await newProduct.save();
        res.status(201).send({message:"New Product Created",payload:productObj});
    } catch(error) {
        console.error("Error creating product:", error);
        res.status(500).send({message:"Error creating product",error:error.message});
    }
});


vendorApp.get("/products",async(req,res)=>{
    const products=await Product.find({isProductActive:true});
    res.status(200).send({message:"All Products",payload:products});
});

// Get vendor's own products (including deleted/inactive ones)
vendorApp.get("/vendor-products/:vendorId", expressAsyncHandler(async(req,res)=>{
    const vendorId = req.params.vendorId;
    if (!vendorId) {
        return res.status(400).send({message:"VendorId required"});
    }
    
    const products = await Product.find({vendorId: vendorId});
    res.status(200).send({message:"Vendor Products", payload:products});
}));


// Middleware to check product ownership
const checkProductOwnership = expressAsyncHandler(async (req, res, next) => {
    const product = await Product.findOne({productId: req.params.productId});
    
    if (!product) {
        return res.status(404).send({message:"Product not found"});
    }
    
    const vendorId = req.body.vendorId || req.query.vendorId;
    if (!vendorId) {
        return res.status(400).send({message:"VendorId is required"});
    }
    
    // Check if the vendor owns this product
    if (product.vendorId.toString() !== vendorId.toString()) {
        return res.status(403).send({message:"You can only edit or delete your own products"});
    }
    
    req.product = product;
    next();
});


vendorApp.put('/product/:productId', checkProductOwnership, async (req, res) => {
    try {
        //get modified product
        const modifiedProduct = req.body;
        //update product by product id
        const latestProduct = await Product.findByIdAndUpdate(modifiedProduct._id,
            { ...modifiedProduct },
            { returnOriginal: false })
        //send res
        res.status(200).send({ message: "product modified", payload: latestProduct })
    } catch(error) {
        console.error("Error updating product:", error);
        res.status(500).send({message:"Error updating product",error:error.message});
    }
})

vendorApp.put('/products/:productId', checkProductOwnership, async (req, res) => {
    try {
        //get modified product
        const modifiedProduct = req.body;
        //update product by product id
        const latestProduct = await Product.findByIdAndUpdate(modifiedProduct._id,
            { ...modifiedProduct },
            { returnOriginal: false })
        //send res
        res.status(200).send({ message: "product deleted or restored", payload: latestProduct })
    } catch(error) {
        console.error("Error updating product:", error);
        res.status(500).send({message:"Error updating product",error:error.message});
    }
})

// Middleware to ensure vendor-only routes
const ensureVendor = expressAsyncHandler(async (req, res, next) => {
    const vendorId = req.params.vendorId;
    if (!vendorId) return res.status(400).send({ message: "vendorId required in params" });
    const vendor = await buyerVendorModel.findById(vendorId);
    if (!vendor || vendor.role !== 'vendor') return res.status(403).send({ message: "Forbidden - vendor only" });
    req.vendor = vendor;
    next();
});

// Get all orders for a vendor
vendorApp.get('/orders/:vendorId', ensureVendor, expressAsyncHandler(async (req, res) => {
    const orders = await Order.find({ vendor: req.vendor._id })
        .populate('buyer', 'firstName lastName email')
        .populate('items.product', 'productName price')
        .sort({ createdAt: -1 });
    
    res.status(200).send({ message: 'Vendor orders', payload: orders });
}));

// Get a single order
vendorApp.get('/order/:orderId', expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.orderId)
        .populate('buyer', 'firstName lastName email')
        .populate('items.product', 'productName price');
    
    if (!order) return res.status(404).send({ message: 'Order not found' });
    res.status(200).send({ message: 'Order details', payload: order });
}));

// Update order status
vendorApp.put('/orders/:orderId', expressAsyncHandler(async (req, res) => {
    const { orderStatus } = req.body;
    
    if (!['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'].includes(orderStatus)) {
        return res.status(400).send({ message: 'Invalid order status' });
    }

    const order = await Order.findByIdAndUpdate(
        req.params.orderId,
        { 
            orderStatus,
            updatedAt: Date.now()
        },
        { new: true }
    ).populate('buyer', 'firstName lastName email')
     .populate('items.product', 'productName price');

    if (!order) return res.status(404).send({ message: 'Order not found' });
    res.status(200).send({ message: 'Order status updated', payload: order });
}));

module.exports=vendorApp;
