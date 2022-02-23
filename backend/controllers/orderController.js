const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const Order = require('../models/orderModel');
const ErrorHandler = require('../utils/errorHandler');

//create new order
exports.newOrder = catchAsyncErrors(async (req, resp, next) => {
    const { 
        shippingInfo, 
        orderItems, 
        paymentInfo, 
        itemsPrice, 
        taxPrice, 
        shippingPrice, 
        totalPrice 
    } = req.body;

    const order = await Order.create({
        shippingInfo, 
        orderItems, 
        paymentInfo, 
        itemsPrice, 
        taxPrice, 
        shippingPrice, 
        totalPrice,
        paidAt:Date.now(),
        user:req.user._id
    });

    resp.status(201).json({
        success:true,
        order
    })
});

//get order detail 
exports.getOrderDetail = catchAsyncErrors(async (req,resp,next) => {
    const orderId = req.params.id;
    const order = await Order.findById(orderId).populate("user","name email");
    if(!order){
        return next(new ErrorHandler('Order does not exists'),404);
    }
    return resp.status(200).json({
        success:true,
        order
    });
});

//get logged in user orders
exports.getMyOrders = catchAsyncErrors(async (req,resp,next) => {
    const orders = await Order.find(req.user._id);
    return resp.status(200).json({
        success:true,
        orders
    })
})