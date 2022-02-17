const Product = require('../models/productModel')
const mongoose = require("mongoose");
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncError = require('../middleware/catchAsyncErrors');

//create product  -- Admin
exports.createProduct = catchAsyncError(async (req, resp, next) => {
    const product = await Product.create(req.body);
    resp.status(201).json({
        success: true,
        product
    })
});

//get all products
exports.getAllProducts = catchAsyncError(async (req, resp, next) => {
    const products = await Product.find();
    resp.status(200).json({
        success: true,
        products
    });
});

//get product detail
exports.getProductDetail = catchAsyncError(async (req, resp, next) => {
    let productId = req.params.id;
    let product = await Product.findById(productId);
    if (!product) {
        return next(new ErrorHandler('product not found', 404))
    }
    return resp.status(200).json({
        success: true,
        product
    })
});

//update product -- Admin
exports.updateProduct = catchAsyncError(async (req, resp, next) => {
    let productId = req.params.id;
    let product = await Product.findById(productId);
    if (!product) {
        return next(new ErrorHandler('product not found', 404))
    }

    product = await Product.findByIdAndUpdate(productId, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });

    resp.status(200).json({
        success: true,
        product
    })
});

//delete product
exports.deleteProduct = catchAsyncError(async (req, resp, next) => {
    let productId = req.params.id;
    let product = await Product.findById(productId);
    if (!product) {
        return next(new ErrorHandler('product not found', 404))
    }

    await product.remove();

    resp.status(200).json({
        success: true,
        message: 'product deleted successfully'
    });
});