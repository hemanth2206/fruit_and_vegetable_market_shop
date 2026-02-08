const exp=require("express")
const buyerApp=exp();
const buyerVendorModel=require("../models/buyerVendorModel");
const expressAsyncHandler=require("express-async-handler");
const createBuyerOrVendor=require("./createBuyerOrVendor");
const Product=require("../models/productModel");
const Cart=require("../models/cartModel");
const Order=require("../models/orderModel");


buyerApp.get("/buyers",(req,res)=>{
    res.send({message:"from buyer api"});
});


buyerApp.post("/buyer",createBuyerOrVendor);

buyerApp.get("/products",async(req,res)=>{
    const products=await Product.find({isProductActive:true});
    res.status(200).send({message:"All Products",payload:products});
});


buyerApp.put('/review/:productId',async(req,res)=>{
    //get comment obj
    const reviewObj=req.body;
   
    //add reviewObj to reviews array of product
   const productWithReviews= await Product.findOneAndUpdate(
        { productId:req.params.productId},
        { $push:{ reviews:reviewObj}},
        {returnOriginal:false})

    
    //send res
    res.status(200).send({message:"review added",payload:productWithReviews});

})

// middleware to ensure buyer-only routes
const ensureBuyer = async (req, res, next) => {
    const buyerId = req.params.buyerId;
    if (!buyerId) return res.status(400).send({ message: "buyerId required in params" });
    const buyer = await buyerVendorModel.findById(buyerId);
    if (!buyer || buyer.role !== 'buyer') return res.status(403).send({ message: "Forbidden - buyer only" });
    req.buyer = buyer;
    next();
};

// Add item to cart
buyerApp.post('/cart/:buyerId/add', ensureBuyer, async (req, res) => {
    const { productId, qty = 1 } = req.body;
    if (!productId || qty <= 0) return res.status(400).send({ message: 'productId and qty>0 required' });

    const product = await Product.findOne({ productId, isProductActive: true });
    if (!product) return res.status(404).send({ message: 'Product not found or inactive' });

    let cart = await Cart.findOne({ buyer: req.buyer._id });
    if (!cart) {
        cart = new Cart({ buyer: req.buyer._id, items: [] });
    }

    const existing = cart.items.find(i => i.productId === productId);
    if (existing) {
        existing.qty += qty;
        existing.price = product.price; // snapshot latest price
    } else {
        cart.items.push({ product: product._id, productId, qty, price: product.price });
    }

    await cart.save();
    // Populate product details before sending response
    const populatedCart = await Cart.findOne({ buyer: req.buyer._id }).populate('items.product', 'productName price productImageUrl');
    res.status(200).send({ message: 'Added to cart', payload: populatedCart });
});

// Get cart
buyerApp.get('/cart/:buyerId', ensureBuyer, async (req, res) => {
    const cart = await Cart.findOne({ buyer: req.buyer._id }).populate('items.product', 'productName price productImageUrl');
    if (!cart) return res.status(200).send({ message: 'Cart empty', payload: [] });
    res.status(200).send({ message: 'Cart', payload: cart });
});

// Update item qty or remove when qty=0
buyerApp.put('/cart/:buyerId/item/:productId', ensureBuyer, async (req, res) => {
    const { qty } = req.body;
    if (qty == null || qty < 0) return res.status(400).send({ message: 'qty required and >=0' });

    const cart = await Cart.findOne({ buyer: req.buyer._id });
    if (!cart) return res.status(404).send({ message: 'Cart not found' });

    const item = cart.items.find(i => i.productId === req.params.productId);
    if (!item) return res.status(404).send({ message: 'Item not in cart' });

    if (qty === 0) {
        cart.items = cart.items.filter(i => i.productId !== req.params.productId);
    } else {
        item.qty = qty;
    }

    await cart.save();
    // Populate product details before sending response
    const populatedCart = await Cart.findOne({ buyer: req.buyer._id }).populate('items.product', 'productName price productImageUrl');
    res.status(200).send({ message: 'Cart updated', payload: populatedCart });
});

// Remove item from cart
buyerApp.delete('/cart/:buyerId/item/:productId', ensureBuyer, async (req, res) => {
    const cart = await Cart.findOne({ buyer: req.buyer._id });
    if (!cart) return res.status(404).send({ message: 'Cart not found' });

    cart.items = cart.items.filter(i => i.productId !== req.params.productId);
    await cart.save();
    // Populate product details before sending response
    const populatedCart = await Cart.findOne({ buyer: req.buyer._id }).populate('items.product', 'productName price productImageUrl');
    res.status(200).send({ message: 'Item removed', payload: populatedCart });
});

// Clear cart
buyerApp.post('/cart/:buyerId/clear', ensureBuyer, async (req, res) => {
    const cart = await Cart.findOne({ buyer: req.buyer._id });
    if (!cart) return res.status(200).send({ message: 'Cart cleared', payload: [] });

    cart.items = [];
    await cart.save();
    res.status(200).send({ message: 'Cart cleared', payload: [] });
});

// Place order - create separate order for each vendor
buyerApp.post('/place-order/:buyerId', ensureBuyer, expressAsyncHandler(async (req, res) => {
    const { cartItems } = req.body;
    
    if (!cartItems || cartItems.length === 0) {
        return res.status(400).send({ message: 'Cart is empty' });
    }

    try {
        // Group items by vendor
        const itemsByVendor = {};
        
        for (const item of cartItems) {
            const product = await Product.findOne({ productId: item.productId });
            if (!product) {
                return res.status(404).send({ message: `Product ${item.productId} not found` });
            }

            const vendorEmail = product.vendorData?.email;
            if (!vendorEmail) {
                return res.status(400).send({ message: `Vendor not found for product ${item.productId}` });
            }

            if (!itemsByVendor[vendorEmail]) {
                itemsByVendor[vendorEmail] = [];
            }
            
            itemsByVendor[vendorEmail].push({
                product: product._id,
                productId: item.productId,
                productName: product.productName,
                qty: item.qty,
                price: item.price,
                totalPrice: item.price * item.qty
            });
        }

        // Create an order for each vendor
        const createdOrders = [];
        
        for (const [vendorEmail, items] of Object.entries(itemsByVendor)) {
            const vendor = await buyerVendorModel.findOne({ email: vendorEmail });
            if (!vendor) {
                return res.status(404).send({ message: `Vendor with email ${vendorEmail} not found` });
            }

            const totalAmount = items.reduce((sum, item) => sum + item.totalPrice, 0);
            const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

            const newOrder = new Order({
                orderId,
                buyer: req.buyer._id,
                buyerEmail: req.buyer.email,
                buyerName: req.buyer.firstName + ' ' + (req.buyer.lastName || ''),
                vendor: vendor._id,
                vendorEmail: vendor.email,
                items,
                totalAmount,
                orderStatus: 'pending'
            });

            const savedOrder = await newOrder.save();
            createdOrders.push(savedOrder);
        }

        // Clear the buyer's cart after successful order creation
        const cart = await Cart.findOne({ buyer: req.buyer._id });
        if (cart) {
            cart.items = [];
            await cart.save();
        }

        res.status(201).send({
            message: 'Orders placed successfully',
            payload: createdOrders
        });

    } catch (error) {
        console.error('Error placing order:', error);
        res.status(500).send({ message: 'Error placing order', error: error.message });
    }
}));

module.exports=buyerApp;