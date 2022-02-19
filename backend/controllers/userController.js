const User = require('../models/userModel')
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncError = require('../middleware/catchAsyncErrors');
const sendJwtToken = require('../utils/sendJwtToken');

//register user
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

    sendJwtToken(user,201,resp);
});

//login user
exports.loginUser = catchAsyncError(async (req,resp,next) => {
    const {email,password} = req.body;
    //check if user has given both email and password
    if(!email || !password){
        return next(new ErrorHandler('Please enter both email & password',401))
    }

    const user = await User.findOne({email}).select("+password");
    if(!user){
        return next(new ErrorHandler('Invalid email or password'),401);
    }

    const isPasswordMatched = await user.comparePassword(password);
    if(!isPasswordMatched){
        return next(new ErrorHandler('Invalid email or password'),401);
    }

    sendJwtToken(user,200,resp);
});

//logout user
exports.logoutUser = catchAsyncError(async (req,resp,next) => {

    resp.cookie("token",null,{
        expires: new Date(Date.now()),
        httpOnly:true
    });

    resp.status(200).json({
        success:true,
        message:'User logged out successfully'
    })
})
