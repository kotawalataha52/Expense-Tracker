import {asyncHandler} from "../utils/asyncHandler.js";
import {Category} from "../models/category.model.js";
import {ApiError} from "../utils/ApiError.js";
import {ApiResponse} from "../utils/ApiResponse.js";

const createCategory = asyncHandler(async (req,res)=>{
    const {name,type} = req.body||{};
    if(!name || !type){
        throw new ApiError(400,"Name and type are required");
    }
    if(!["income","expense"].includes(type)){
        throw new ApiError(400,"Invalid category type");
    }
    const category = await Category.create({
        name,
        type,
        user: req.user._id
    })
    if(!category){
        throw new ApiError(500,"Something went wrong");
    }
    return res
    .status(201)
    .json(new ApiResponse(200,
        {
            data:category
        },
        "Category created successfully"
    )
)
});

const getCategories = asyncHandler(async (req,res) => {
    const categories = await Category.find({user:req.user._id});
    // if(!categories){
    //     return [];
    // }
    return res
    .status(200)
    .json(new ApiResponse(200,
        {
            data:categories
        },
        "Categories fetched successfully"
    ))
});

export {createCategory,getCategories};