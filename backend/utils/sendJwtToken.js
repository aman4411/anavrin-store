//creating jwt token and saving in cookie
const sendToken = (user,statusCode,resp) => {

    const token = user.getJWTToken();

    //options for cookie
    const cookieOptions = {
        httpOnly:true,
        expires:new Date(Date.now + process.env.COOKIE_EXPIRE *24*60*60*1000)
    }

    resp.status(statusCode).cookie('jwtToken',token,cookieOptions).json({
        success:true,
        token,
        user
    })
}

module.exports = sendToken;