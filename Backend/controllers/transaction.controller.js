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

const updateTransactions = asyncHandler(async (req,res) => {
    const {id} = req.params||{};
    if(!id){
        throw new ApiError(400,"Id is required");
    }
    const {amount,type,category,note} = req.body||{};

    if (amount === undefined && type === undefined && category === undefined && note === undefined) {
        throw new ApiError(400, "At least one field is required");
    }
    if (type && !["income", "expense"].includes(type)) {
         throw new ApiError(400, "Invalid transaction type");
        }

    const transaction = await Transaction.findOne({
        _id:id,
        user:req.user._id
    })
    if(!transaction){
        throw new ApiError(404,"Transaction not found");
    }
    if(category){
        const foundCategory = await Category.findOne({ _id: category,user:req.user._id});

    if(!foundCategory){
        throw new ApiError(404,"Category not found");
    }
    transaction.category = category;
}
    if (amount !== undefined) transaction.amount = amount;
    if (type !== undefined) transaction.type = type;
    if (note !== undefined) transaction.note = note;

    const updatedTransaction = await transaction.save();

    return res.status(200).json(new ApiResponse(200,updatedTransaction,"Transactions updated successfully"));

});

const deleteTransaction = asyncHandler(async (req,res) => {
    const {id} = req.params || {};

    if(!id){
        throw new ApiError(400,"Transaction id is required");
    }

    const deletedTransaction = await Transaction.findOneAndDelete({
        _id:id,
        user:req.user._id
    });
    if(!deletedTransaction){
        throw new ApiError(404,"Transaction not found");
    }
    return res.status(200).json(new ApiResponse(200,deletedTransaction,"Transaction deleted successfully"));
});

const getTransactionSummary = asyncHandler(async (req, res) => {
    const { month } = req.query;

    let matchStage = {
        user: req.user._id
    };

    if (month) {
        if (!/^\d{4}-\d{2}$/.test(month)) {
            throw new ApiError(400, "Invalid month format. Use YYYY-MM");
        }

        const startDate = new Date(`${month}-01`);
        const endDate = new Date(startDate);
        endDate.setMonth(endDate.getMonth() + 1);

        matchStage.date = {
            $gte: startDate,
            $lt: endDate
        };
    }

    const summary = await Transaction.aggregate([
        { $match: matchStage },
        {
            $group: {
                _id: "$type",
                totalAmount: { $sum: "$amount" }
            }
        }
    ]);

    let totalIncome = 0;
    let totalExpense = 0;

    summary.forEach(item => {
        if (item._id === "income") totalIncome = item.totalAmount;
        if (item._id === "expense") totalExpense = item.totalAmount;
    });

    const balance = totalIncome - totalExpense;

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                totalIncome,
                totalExpense,
                balance
            },
            "Transaction summary fetched successfully"
        )
    );
});

const getCategorySummary = asyncHandler(async (req, res) => {
    const { month } = req.query;

    let matchStage = {
        user: req.user._id
    };

    if (month) {
        if (!/^\d{4}-\d{2}$/.test(month)) {
            throw new ApiError(400, "Invalid month format");
        }

        const startDate = new Date(`${month}-01`);
        const endDate = new Date(startDate);
        endDate.setMonth(endDate.getMonth() + 1);

        matchStage.date = {
            $gte: startDate,
            $lt: endDate
        };
    }

    const summary = await Transaction.aggregate([
        { $match: matchStage },
        {
            $group: {
                _id: "$category",
                totalAmount: { $sum: "$amount" }
            }
        },
        {
            $lookup: {
                from: "categories",
                localField: "_id",
                foreignField: "_id",
                as: "categoryDetails"
            }
        },
        { $unwind: "$categoryDetails" },
        {
            $project: {
                _id: 0,
                category: "$categoryDetails.name",
                total: "$totalAmount"
            }
        }
    ]);

    return res.status(200).json(
        new ApiResponse(
            200,
            { categories: summary },
            "Category-wise summary fetched successfully"
        )
    );
});


export {createTransaction, getTransactions,updateTransactions,deleteTransaction, getTransactionSummary, getCategorySummary};