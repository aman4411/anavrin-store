module.exports = catchAsyncError => (req,resp,next) =>{
    Promise.resolve(catchAsyncError(req,resp,next))
    .catch(next);
}