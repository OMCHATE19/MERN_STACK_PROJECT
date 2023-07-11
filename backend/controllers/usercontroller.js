const ErrorHander = require("../utils/errorhander");
const catchAsyncErrors=require("../middleware/catchAsyncErrors");
const User=require("../models/userModel");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");

//register a user 
exports.registerUser = catchAsyncErrors( async(req,res,next)=>{
    const {name,email,password}=req.body;
    const user =await User.create({
        name,
        email,
        password,
        avatar:{
            public_id:"this is a sample id",
            url:"profilepicUrl",
        },
    });
    sendToken(user,201,res);

});
 //logn user
 exports.loginUser = catchAsyncErrors(async(req,res,next)=>{
    const{email,password} = req.body;
    if(!email || !password){
        return next(new ErrorHander("Please enter email & password",400));

    }
    const user = await User.findOne({email}).select("+password");
    if(!user){
        return next(new ErrorHander("Invalid email or password",401));
    }
    const isPasswordMatched = user.comparePassword(password);

    if(!isPasswordMatched){
        return next(new ErrorHander("Invalid email or password",401));
    }
    sendToken(user,200,res);

});

 //logout
 exports.logout=catchAsyncErrors(async(req,res,next)=>{
    res.cookie("token",null,{
        expires: new Date(Date.now()),
        httpOnly:true,
    } );
 


    res.status(200).json({
        success:true,
        message:"Logged out",
    });

 });
 //forgot password
exports.forgotPassword = catchAsyncErrors(async(req,res,next)=>{
    const user = await User.findOne({email:req.body.email});
    if(!user){
        return next(new ErrorHander("user not found",404));

    }
    //get reset password token
    const resetToken = user.getResetPasswordToken();
    await user.save({validateBeforeSave:false});
    const resetPasswordUrl=`${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`;
    const message =`your password rest token is :- \n\n${resetPasswordUrl}\n\nIf you have not requested this email then ,please ignore it`;
    try{
        await sendEmail({
           email:user.email,
            subject:`Ecommerce Passwod recovery`,
            message,

        })
        res.status(200).json({
            success:true,
            message:`email send to ${user.email}successfully`,
        })

    }catch(error){
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire=undefined;
        await user.save({validateBeforeSave:false});
        return next(new ErrorHander(error.message,500));
    }
}) ;

// reset password
exports.resetPassword = catchAsyncErrors(async(req,res,next)=>{
const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");  
    const user= await User.findOne({
        resetPasswordToken,
        resetPasswordExpire:{ $gt:Date.now()},
    });
    if(!user){
        return next(new ErrorHander("Reset Password TOken is invalid or has been expired",400));


    }
    if(req.body.password!==req.body.confirmPassword){
        return next(new ErrorHander("Reset Password TOken is invalid or has been expired",400));


    }
    user.password=req.body.password;
    user.resetPasswordToken = undefined;
     user.resetPasswordExpire=undefined;
     await user.save();
     sendToken(user,200,res);

});
// get user detail
exports.getUserDetails = catchAsyncErrors(async(req,res,next)=>{
    const user = await User.findById(req.user.id);
    res.status(200).json({
        success:true,
        user,
    });
});
//update user password 
exports.updatePassword = catchAsyncErrors(async(req,res,next)=>{
    const user = await User.findById(req.user.id).select("+password");
    const isPasswordMatched = await user.comparePassword(req.body.oldPassword);
    if(!isPasswordMatched){
        return next(new ErrorHander("old passwprd is incorrect",400));
    }
    if(req.body.newPassword !== req.body.confirmPassword){
        return next(new ErrorHander("password doesnot match",400));
    }
    user.password = req.body.newPassword;

   await user.save();
   sendToken(user,200,res);
});
//update user profile
exports.updateProfile = catchAsyncErrors(async(req,res,next)=>{
   const newUserData ={
    name:req.body.name,
    email:req.body.email,
   };
   //we will add cloudinary later
   const user = await User.findByIdAndUpdate(req.user.id,newUserData,{
    new:true,
    runValidators:true,
    useFindAndModify:false,
   });
   res.status(200).json({
    success:true,
   });
});
