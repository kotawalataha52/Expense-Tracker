import mongoose from "mongoose";
import {User} from './User.model.js';

const categorySchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    type:{
        type:String,
        enum:["income","expense"],
        required:true
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
},{timestamps:true});

export const Category = mongoose.model("Category",categorySchema);

