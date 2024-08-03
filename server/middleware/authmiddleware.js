import jwt from "jsonwebtoken";
import { asyncHandler } from "../handlers/errorHandlers.js";

export const verifyToken = asyncHandler(async (req,res,next) => {
    const token = req.header('x-auth-token');
    if(!token) {return res.status(401).json({status:"error",message:"No token provided"})}


    try {
        const decoded = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        if(error.name === "TokenExpiredError"){
            return res.status(401).json({status:"error",message:"Token has expired"})
        }
        return res.status(401).json({status:"error",message:"Invalid token"})
    }
})