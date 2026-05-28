import express from "express";
import cors from "cors";


const app = express();
app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}));

app.use(express.json({ limit: "10mb" }));

app.use(express.urlencoded({limit:"10mb",extended:true}))

// app.use(express.static());
import userRouter from "./routes/auth.js";

app.use("/api/v1/users",userRouter);

import categoryRouter from "./routes/category.js";

app.use("/api/v1/categories",categoryRouter);


export default app;