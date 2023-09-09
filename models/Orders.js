const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User who placed the order
        required: true,
    },
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
            },
        },
    ],
    orderDate: {
        type: Date,
        default: Date.now, 
    },
    totalAmount: {
        type: Number,
        required: true,
    },
    status : {
        type : String,
        enum : ['Ordered', "Confirmed", "Shipped", "Cancelled", "Completed"],
        default : 'Ordered'
    },
    paymentMod : {
        type : String,
        enum : ["Online", "COD"],
        default : "COD",
        required : true,
    },
    shippingAddress : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref : 'Address',
    }
});

module.exports = mongoose.model('Orders', orderSchema);
