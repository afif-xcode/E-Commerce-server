const Orders = require('../models/Orders');
const User = require('../models/User');
const Product = require('../models/Product');
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
        // creating a new Order 
        const newOrder = await Orders.create(
            {   user : userId,
                products,
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
exports.orderDetails = async (req,res) => {
    try {
        // get order id from req.params 
        const {orderId} = req.params;
        
        const orderDetails = await Orders.findById(orderId).populate('products').exec();
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
                message : "Order details fetch successfully"
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

        const user = await User.find(userId).populate('orders').exec();
        const userOrder = user.orders;

        if(userOrder.length === 0) {
            return res.status(StatusCodes.NOT_FOUND).json(
                {
                    success : false,
                    message : "NO orders found",
                }
            )
        }

        return res.status(StatusCodes.OK).json(
            {
                success : true,
                message : "Order fetched successfully",
                data : userOrder,
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