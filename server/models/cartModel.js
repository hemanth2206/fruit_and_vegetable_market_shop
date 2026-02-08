const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'buyerVendor', required: true, unique: true },
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'product', required: true },
    productId: { type: String, required: true },
    qty: { type:Number, default:1 },
    price: { type: Number, required: true },
    addedAt: { type: Date, default: Date.now }
  }]
});

const Cart = mongoose.model('cart', cartSchema);
module.exports = Cart;