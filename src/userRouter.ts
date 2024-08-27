import express, { Request, Response } from "express";

const userRouter = express.Router();


userRouter.post('/register',(request:Request, response:Response)=>{
    response.json({
        message: "User registered"
    })
})

export default userRouter;
