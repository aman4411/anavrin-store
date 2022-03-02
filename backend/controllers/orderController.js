const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const Order = require('../models/orderModel');
const Product = require('../models/productModel');
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
});

//get all orders -- Admin
exports.getAllOrders = catchAsyncErrors(async (req,resp,next) => {
    const orders = await Order.find();

    let totalAmount = 0;
    orders.forEach(order => {
        totalAmount += order.totalPrice;
    })
    return resp.status(200).json({
        success:true,
        totalAmount,
        orders
    });
});

//update order status -- Admin
exports.updateOrder = catchAsyncErrors(async (req,resp,next) => {
    const order = await Order.findById(req.params.id);

    if(!order){
        return next(new ErrorHandler('Order does not exists',400));
    }
    
    if(order.orderStatus === 'Delivered'){
        return next(new ErrorHandler("You have already delivered this order",400));
    }

    order.orderItems.forEach( async orderItem => {
        await updateStock(orderItem.product,orderItem.quantity);
    });

    order.orderStatus = req.body.status;
    if(req.body.status === "Delivered"){
        order.deliveredAt = Date.now();
    }
    
    await order.save({validateBeforeSave:false});
    return resp.status(200).json({
        success:true,
        message:'Order has been updated successfully'
    });
});

async function updateStock(productId,quantity){
    const product = await Product.findById(productId);
    product.stock -= quantity;
    await product.save({validateBeforeSave:true})
}

//delete order -- Admin
exports.deleteOrder = catchAsyncErrors(async (req,resp,next) => {
    const order = await Order.findById(req.params.id);
    if(!order){
        return next(new ErrorHandler('Order does not exists',400));
    }
    await order.remove();
    resp.status(200).json({
        success:true,
        message:'Order has been deleted successfully'
    });
});