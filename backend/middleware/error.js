const ErrorHandler = require('../utils/errorHandler');

module.exports = (err,req,res,next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || 'Internal Server Error';

    //mongodb wrong id error
    if(err.name == 'CastError'){
        const message = `Resource not found. Invalid path provided.`;
        err = new ErrorHandler(message,400);
    }

    //mongoose duplicate key error
    if(err.code === 11000){
        const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
        err = new ErrorHandler(message,400);
    }

    //wrong jwt error
    if(err.name === `JsonWebTokenError`){
        const message = `Json Web Token is invalid. Try Again`;
        err = new ErrorHandler(message,400);
    }

    //wrong expire error
    if(err.name === `TokenExpireError`){
        const message = `Json Web Token is expired. Try Again`;
        err = new ErrorHandler(message,400);
    }

    res.status(err.statusCode).json({
        success:false,
        message:err.message
    })
}