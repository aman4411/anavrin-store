const User = require('../models/userModel')
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncError = require('../middleware/catchAsyncErrors');

exports.registerUser = catchAsyncError(async (req,resp,next) => {
    const {name,email,password} = req.body;
    const user = await User.create({
        name,
        email,
        password,
        avatar: {
            public_id:`sample public id`,
            url:`sample url`
        }
    });

    resp.status(201).json({
        success:true,
        user
    });
}) 
