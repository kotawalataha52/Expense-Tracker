const asyncHandler = (requestHandler)=> async (req,res,next) => {
    try {
      await requestHandler(req,res,next);
    } catch (error) {
        if(typeof next ==="function"){
            return next(error);
        }
        res.status(error.statusCode || 500).json({
            success:false,
            message:error.message || "Something went wrong"
        });
    }
}

export {asyncHandler};