const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    orderId: {
        type: String,
        required: true,
        unique: true
    },
    buyer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'buyerVendor',
        required: true
    },
    buyerEmail: {
        type: String,
        required: true
    },
    buyerName: {
        type: String,
        required: true
    },
    vendor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'buyerVendor',
        required: true
    },
    vendorEmail: {
        type: String,
        required: true
    },
    items: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'product',
            required: true
        },
        productId: {
            type: String,
            required: true
        },
        productName: {
            type: String,
            required: true
        },
        qty: {
            type: Number,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        totalPrice: {
            type: Number,
            required: true
        }
    }],
    totalAmount: {
        type: Number,
        required: true
    },
    orderStatus: {
        type: String,
        enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, { strict: "remove" });

const Order = mongoose.model('order', orderSchema);
module.exports = Order;
