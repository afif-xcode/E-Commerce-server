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
        enum : ['Ordered', "Confirmed", "Shipped", "Cancelled", "Completed"]
    },
    paymentMod : {
        type : String,
        enum : ["Online", "COD"]
    },
    shippingAddress : {
        type : mongoose.Schema.Types.ObjectId,
        require : true,
        ref : 'Address',
    }
});

module.exports = mongoose.model('Order', orderSchema);
