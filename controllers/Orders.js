const Orders = require('../models/Orders');
const User = require('../models/User');
const Product = require('../models/Product');
const mongoose = require('mongoose')
const { StatusCodes } = require("http-status-codes");

// create a order
exports.createOrder = async(req, res) => {
    try {
        // fetch all the data
        const userId = req.user.id;
        const {products, totalAmount, paymentMod, shippingAdress} = req.body;

        // validate data
        if (
            products.length == 0 ||
            !totalAmount ||
            !paymentMod ||
            !shippingAdress
        ) {
            return res.status(StatusCodes.NOT_FOUND).json({
            success: false,
            message: "All fields are required",
            });
        }

        const productIds = products.map(product => product.product);
        const productsFound = await Product.find({ _id: { $in: productIds } });

        if (productIds.length !== productsFound.length) {
        return res.status(400).json({ error: 'Invalid product IDs' });
        }

        // creating a new Order 
        const newOrder = await Orders.create(
            {   user : userId,
                products: products.map(productIndex => ({
                    product: productIndex.product,
                    quantity: productIndex.quantity,
                })),
                totalAmount,
                paymentMod,
                shippingAddress: shippingAdress,
            }
        )
        // insert order id on user model 
        const updateUser = await User.findByIdAndUpdate(
            { _id: userId },
            {
              $push: {
                orders: newOrder._id,
              },
            },
            { new: true }
          );

        return res.status(StatusCodes.OK).json(
            {
                success : true,
                message : "Ordered Placed successfully",
                data : {
                    newOrder,
                    updateUser,
                },
            }
        )

    }catch(error) {
        console.log("ERROR FROM ORDER CONTROLLER CREATE ORDER");
        console.log(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
            {
                success : false,
                message : "Something went wrong while creating order"
            }
        )
    }
}

// show order by id
exports.getOrderDetails = async (req,res) => {
    try {
        // get order id from req.params 
        const orderId = req.body.orderId;
        const orderDetails = await Orders.findById(orderId).populate([{path : 'user'}, {path : 'products', populate : 'product'}, {path : "shippingAddress"}]).exec();
        if(!orderDetails) {
            return res.status(StatusCodes.NOT_FOUND).json(
                {
                    success : false,
                    message : "Order did not found",
                    data : orderDetails,
                }
            )
        }

        return res.status(StatusCodes.OK).json(
            {
                success : true,
                message : "Order details fetch successfully",
                data : orderDetails,
            }
        )
    }catch(error) {
        console.log("ERROR FROM ORDER CONTROLLER ORDER DETAILS");
        console.log(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
            {
                success : false,
                message : "Something went wrong while fetching order details"
            }
        )
    }
}

// show all orders
exports.showAllOrdersofUser = async(req,res) => {
    try {
        const userId = req.user.id;

        const userActiveOrders = await Orders.find({
            user: userId,
            status: { $nin: ['Cancelled', 'Completed'] }
        }).populate([{path : 'user'}, {path : 'products', populate : 'product'}, {path : "shippingAddress"}]).exec();

        const userCompletedOrders = await Orders.find({
        user: userId,
        status: "Completed"
        }).populate([{path : 'user'}, {path : 'products', populate : 'product'}, {path : "shippingAddress"}]).exec();

        const userCancelledOrders = await Orders.find({
            user: userId,
            status: "Cancelled"
        }).populate([{path : 'user'}, {path : 'products', populate : 'product'}, {path : "shippingAddress"}]).exec();

        return res.status(StatusCodes.OK).json(
            {
                success : true,
                message : "Order fetched successfully",
                data : {
                    userActiveOrders,
                    userCompletedOrders,
                    userCancelledOrders
                },
            }
        )
    }catch(error) {
        console.log("ERROR FROM ORDER CONTROLLER SHOW ALL ORDERS");
        console.log(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
            {
                success : false,
                message : "Something went wrong while fetching show all orders"
            }
        )
    }
}

// Change the status of an order by ID
exports.updateOrderStatus = async (req, res) => {
    try {
    const { status, orderId } = req.body;
      // Validate the provided status
      const allowedStatusValues = ['Ordered', 'Confirmed', 'Shipped', 'Cancelled', 'Completed'];
      if (!allowedStatusValues.includes(status)) {
        return res.status(StatusCodes.BAD_REQUEST).json(
            {
                success : false,
                message : "Invalid status value"
            }
        );
      }
  
      // Update the order status using findOneAndUpdate
      const updatedOrder = await Orders.findOneAndUpdate(
        { _id: orderId },
        { $set: { status } },
        { new: true, runValidators: true }
      );
  
      if (!updatedOrder) {
        return res.status(StatusCodes.NOT_FOUND).json(
            {
                success : false,
                message : "Order not found"
            }
        );
      }
      res.status(StatusCodes.OK).json(
        {
            success : true,
            message : "Order status change successfully"
        }
      );
    }catch(error) {
        console.log("ERROR FROM ORDER CONTROLLER CHANGING ORDER STATUS");
        console.log(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
            {
                success : false,
                message : "Something went wrong while changing order status"
            }
        )
    }
};

// Get all orders for admin
exports.showAllOrders = async(req,res) => {
    try {
        const userActiveOrders = await Orders.find({
            status: { $nin: ['Cancelled', 'Completed'] }
        }).populate([{path : 'user'}, {path : 'products', populate : 'product'}, {path : "shippingAddress"}]).exec();

        const userCompletedOrders = await Orders.find({
        status: "Completed"
        }).populate([{path : 'user'}, {path : 'products', populate : 'product'}, {path : "shippingAddress"}]).exec();

        const userCancelledOrders = await Orders.find({
            status: "Cancelled"
        }).populate([{path : 'user'}, {path : 'products', populate : 'product'}, {path : "shippingAddress"}]).exec();

        return res.status(StatusCodes.OK).json(
            {
                success : true,
                message : "Order fetched successfully",
                data : {
                    userActiveOrders,
                    userCompletedOrders,
                    userCancelledOrders
                },
            }
        )
    }catch(error) {
        console.log("ERROR FROM ORDER CONTROLLER SHOW ALL ORDERS");
        console.log(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
            {
                success : false,
                message : "Something went wrong while fetching show all orders"
            }
        )
    }
}
