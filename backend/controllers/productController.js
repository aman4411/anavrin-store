const Product = require('../models/productModel')
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncError = require('../middleware/catchAsyncErrors');
const ApiFeatures = require('../utils/apiFeatures');

//create product  -- Admin
exports.createProduct = catchAsyncError(async (req, resp, next) => {
    req.body.createdBy = req.user.id;
    const product = await Product.create(req.body);
    resp.status(201).json({
        success: true,
        product
    })
});

//get all products
exports.getAllProducts = catchAsyncError(async (req, resp, next) => {
    const resultPerPage = 8;
    const productCount = await Product.countDocuments();
    const apiFeature = new ApiFeatures(Product.find(),req.query).search().filter().pagination(resultPerPage);
    const products = await apiFeature.query;
    resp.status(200).json({
        success: true,
        productCount,
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

//create or update review
exports.createProductReview = catchAsyncError(async (req, resp, next) => {
    const {rating,comment,productId} = req.body;
    const review = {
        user:req.user.id,
        name:req.user.name,
        rating:Number(rating),
        comment
    };

    const product = await Product.findById(productId);

    const isReviewed = product.reviews.find(review => review.user.toString() === req.user._id.toString());
    if(isReviewed){
        product.reviews.forEach(review => {
            if(review.user.toString() === req.user._id.toString()){
                review.rating = rating;
                review.comment = comment
            }
        })
    }else{
        product.reviews.push(review);
        product.numOfReviews = product.reviews.length;
    }

    //get average of total ratings
    let totalRatings = 0;
    product.reviews.forEach(review => {
        totalRatings += review.rating
    });
    product.ratings = totalRatings/product.reviews.length;
    
    await product.save({validateBeforeSave:false});
    resp.status(200).json({
        success:true,
        message:'Review posted successfully'
    })
});

//get all reviews of a product
exports.getProductReviews = catchAsyncError(async (req,resp,next) => {
    const product = await Product.findById(req.query.id);
    if(!product){
        return next(new ErrorHandler('Product not found'),404);
    }
    resp.status(200).json({
        success:true,
        reviews:product.reviews
    });
});

exports.deleteProductReview = catchAsyncError(async (req,resp,next) => {
    console.log('hello');
    const product = await Product.findById(req.query.productId);
    if(!product){
        return next(new ErrorHandler('Product not found'),404);
    }

    const reviews = product.reviews.filter(review => review._id.toString()!== req.query.id.toString());
    //get average of total ratings
    let totalRatings = 0;
    reviews.forEach(review => {
        totalRatings += review.rating
    });
    console.log(totalRatings);
    const ratings = totalRatings == 0 ? 0 : totalRatings/reviews.length;
    const numOfReviews = reviews.length;

    await Product.findByIdAndUpdate(req.query.productId,{
        reviews,
        ratings,
        numOfReviews
    },
    {
        new:true,
        runValidators:true,
        useFindAndModify:false
    })

    resp.status(200).json({
        success:true,
        message:'Review deleted successfully'
    });
});