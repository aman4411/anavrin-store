const User = require('../models/userModel')
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncError = require('../middleware/catchAsyncErrors');
const sendJwtToken = require('../utils/sendJwtToken');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');
const sendToken = require('../utils/sendJwtToken');

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

//get user details
exports.getUserDetails = catchAsyncError(async (req,resp,next) => {
    const user = await User.findById(req.user.id);
    if(!user){
        return next(new ErrorHandler('User does not exists'),404);
    }
    resp.status(200).json({
        success:true,
        user
    })
});

//update user password
exports.updatePassword = catchAsyncError(async (req,resp,next) => {
    const user = await User.findById(req.user.id).select('+password');
    if(!user){
        return next(new ErrorHandler('User does not exists'),404);
    }
    const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

    if(!isPasswordMatched){
        return next(new ErrorHandler('Old password is not correct'),400);
    }

    if(req.body.newPassword !== req.body.confirmNewPassword){
        return next(new ErrorHandler('Password does not match'),400);
    }

    user.password = req.body.newPassword;
    await user.save();
    sendToken(user,200,resp);
});

//update user profile
exports.updateProfile = catchAsyncError(async (req,resp,next) => {
    const newUser = {
        name:req.body.name,
        email:req.body.email
    }
    const user = await User.findByIdAndUpdate(req.user.id, newUser , {
        new:true,
        runValidators:true,
        useFindAndModify:false
    });
    resp.status(200).json({
        success:true,
        message:'User profile has been successfully updated'
    })
});

//get all users data -- admin
exports.getAllUsers = catchAsyncError(async (req,resp,next) => {
    const users = await User.find();
    resp.status(200).json({
        success:true,
        users
    })
});

//get single user data -- admin
exports.getSingleUser = catchAsyncError(async (req,resp,next) => {
    const user = await User.findById(req.params.id);
    if(!user){
        return next(new ErrorHandler('User does not exists'),404);
    }
    resp.status(200).json({
        success:true,
        user
    })
});

//update user role -- admin
exports.updateUserRole = catchAsyncError(async (req,resp,next) => {
    const newUser = {
        name:req.body.name,
        email:req.body.email,
        role:req.body.role
    }
    const user = await User.findByIdAndUpdate(req.params.id, newUser , {
        new:true,
        runValidators:true,
        useFindAndModify:false
    });
    resp.status(200).json({
        success:true,
        message:'User profile has been successfully updated'
    })
});

//delete user profile -- admin
exports.deleteUser = catchAsyncError(async (req,resp,next) => {
    
    const user = await User.findById(req.params.id);
    if(!user){
        return next(new ErrorHandler('User does not exists'),404);
    }
    await user.remove();
    resp.status(200).json({
        success:true,
        message:'User profile has been deleted successfully.'
    })
});