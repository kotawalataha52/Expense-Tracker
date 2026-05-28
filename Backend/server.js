import dotenv from "dotenv";
dotenv.config({ path: "./Backend/.env" });
import {connectionDB} from "./config/db.js";
import app from './app.js';


connectionDB()
.then(()=>{
    app.listen(process.env.PORT,()=>{
        console.log(`Server is running at port : ${process.env.PORT}`);
    })
})
.catch((err)=>{
    console.log(`Mongo DB connection Failed!! : `,err);
})