import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import {User} from "../models/User.model.js";
import jwt from 'jsonwebtoken';


// const generatingAccessToken = async (userId) => {
//     try{
//         const user = await User.findById(userId);
//     const accessToken = user.generateAccessToken();
//     await user.save({validateBeforeSave:false});
//     return {accessToken};
//     }catch(error){
//         throw new ApiError(500,"Something went wrong");
//     }
//     }
// NOT NECCESSARY AS WE HAVE DEFINED THIS FUNCTION IN USER MODEL ITSELF

const userRegister = asyncHandler(async (req,res) => {
    const{name,email,password} = req.body || {};

    if ([name, email, password].some(field => !field)) {
    throw new ApiError(400, "All fields are required");
}
    const existingUser = await User.findOne({
        $or:[{email},{name}]
    })
    if(existingUser){
        throw new ApiError(409,"User with email or name already exists");
    }
    const user = await User.create({
        name,
        email,
        password
    })

    const createdUser = await User.findById(user._id).select("-password");

    if(!createdUser){
        throw new ApiError(500,"Something went wrong");
    }
    return res.status(201).json(
        new ApiResponse(200,createdUser,"User registered successfully")
    )

})

const userLogin = asyncHandler(async (req,res) => {
    const {email,password} = req.body||{};

    if(!password || !email){
        throw new ApiError(400,"Email and password is required");
    }

    const user = await User.findOne({email})
    if(!user){
        throw new ApiError(401,"User is not registered");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if(!isPasswordValid){
        throw new ApiError(401,"Invalid credentials");
    }
    const accessToken = user.generateAccessToken();

    const userLoggedIn = await User.findById(user._id).select("-password");

    if(!userLoggedIn){
        throw new ApiError(400,"User is not logged in");
    }

    res
    .status(200)
    .json(
        new ApiResponse(200,
            { user: userLoggedIn, accessToken },
            "User logged in successfully"
        )
    )
})



export {userRegister,userLogin};