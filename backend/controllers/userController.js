const User = require('../models/userModel')
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncError = require('../middleware/catchAsyncErrors');
const sendJwtToken = require('../utils/sendJwtToken');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');

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
});

//forgot password
exports.forgotPassword = catchAsyncError(async (req,resp,next) => {

    const user = await User.findOne({email:req.body.email});

    if(!user){
        return next(new ErrorHandler('User does not exists'),404);
    }

    //get reset password token
    const resetPasswordToken = user.getResetPasswordToken();
    await user.save({validateBeforeSave: false});

    const resetPasswordUrl = `${req.protocol}://${req.get("host")}/api/user/password/reset/${resetPasswordToken}`;

    const message = `Hello ${user.name} \n\nYour password reset token is : \n\n${resetPasswordUrl} \n\nIf you have not requested this email, then please ignore it. \n\nThanks & Regards\nTeam Anavrin Store.`

    try{
        await sendEmail({
            email:user.email,
            subject:`Anavrin Store Account : Password Recovery`,
            message
        });
        
        resp.status(200).json({
            success:true,
            message:`Password reset email has been sent to email : ${user.email}`
        })
    }catch (error){
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({validateBeforeSave: false});
        return next(new ErrorHandler(error.message,500));
    }

});

//reset password
exports.resetPassword = catchAsyncError(async (req,resp,next) => {
    //creating token hash
    const resetPasswordToken  = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire:{$gt:Date.now()}
    });

    if(!user){
        return next(new ErrorHandler('Invalid Request'),400);
    }

    if(req.body.password !== req.body.confirmPassword){
        return next(new ErrorHandler('Password does not match'),400);
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    sendJwtToken(user,200,resp);
});
