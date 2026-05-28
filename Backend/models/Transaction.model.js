import mongoose from 'mongoose';
import { User } from './User.model.js';
import { Category } from './Category.model.js';

const transactionSchema = new mongoose.Schema({
    amount:{
        type:Number,
        required:true
    },
    type:{
        type:String,
        enum:["income","expense"],
        required:true
    },
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Category"
    },
    note :{
        type:String
    },
    date:{
        type:Date,
        default:Date.now
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    }
},{timestamps:true});

export const Transaction = mongoose.model("Transaction",transactionSchema);