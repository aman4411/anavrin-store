const Product = require('../models/productModel')
const mongoose = require("mongoose");

//create product  -- Admin
exports.createProduct = async (req,resp,next) => {
    const product = await Product.create(req.body);
    resp.status(201).json({
        success:true,
        product
    })
}

//get all products
exports.getAllProducts = async (req,resp) => {
    const products = await Product.find();
    resp.status(200).json({
        success:true,
        products
    });
}

//get product detail
exports.getProductDetail = async (req,resp,next) => {
    let productId = req.params.id;
    if(!mongoose.Types.ObjectId.isValid(productId)){
        return resp.status(500).json({
            success:false,
            message:'invalid product id'
        })
    }
    let product = await Product.findById(productId);
    if(!product){
        return resp.status(500).json({
            success:false,
            message:'product not found'
        })
    }
    return resp.status(200).json({
        success:true,
        product
    })
}

//update product -- Admin
exports.updateProduct = async (req,resp,next) => {
    let productId = req.params.id;
    if(!mongoose.Types.ObjectId.isValid(productId)){
        return resp.status(500).json({
            success:false,
            message:'invalid product id'
        })
    }
    let product = await Product.findById(productId);
    if(!product){
        return resp.status(500).json({
            success:false,
            message:'product not found'
        })
    }

    product = await Product.findByIdAndUpdate(productId,req.body,{
        new:true,
        runValidators:true,
        useFindAndModify:false
    });

    resp.status(200).json({
        success:true,
        product
    })
}

//delete product
exports.deleteProduct = async (req,resp,next) => {
    let productId = req.params.id;
    if(!mongoose.Types.ObjectId.isValid(productId)){
        return resp.status(500).json({
            success:false,
            message:'invalid product id'
        })
    }
    let product = await Product.findById(productId);
    if(!product){
        return resp.status(500).json({
            success: false,
            message: 'product not found'
        })
    }

    await product.remove();

    resp.status(200).json({
        success:true,
        message:'product deleted successfully'
    });
}