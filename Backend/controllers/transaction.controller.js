import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Transaction } from "../models/Transaction.model.js";
import { Category } from "../models/Category.model.js";

const createTransaction = asyncHandler(async (req,res) => {
    const {amount,type,category,note} = req.body||{};

    if(!amount || !category || !type){
        throw new ApiError(400,"These fields are required");
    }
    if(!["income","expense"].includes(type)){
            throw new ApiError(400,"Invalid category type");
        }
    const foundCategory = await Category.findOne({ _id: category,user:req.user._id});

    if(!foundCategory){
        throw new ApiError(404,"Category not found");
    }
    const transaction = await Transaction.create({
        amount,
        type,
        category:foundCategory._id,
        note,
        user: req.user._id
    });

    if(!transaction){
        throw new ApiError(500,"Something went wrong");
    }

    return res.status(201).json(new ApiResponse(201,transaction,"Transaction done successfully"));
});

const getTransactions = asyncHandler(async (req, res) => {

    const { month, category } = req.query;

    let filter = {
        user: req.user._id
    };

    if (month) {
        const startDate = new Date(`${month}-01`);
        const endDate = new Date(startDate);
        endDate.setMonth(endDate.getMonth() + 1);

        filter.date = {
            $gte: startDate, 
            $lt: endDate
        };
    }
    if (category) {
        filter.category = category;
    }
    const transactions = await Transaction.find(filter)
        .populate("category", "name type") 
        .sort({ date: -1 });

    return res.status(200).json(
        new ApiResponse(200, transactions, "Transactions fetched successfully")
    );
});
export {createTransaction, getTransactions};