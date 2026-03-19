import jwt from 'jsonwebtoken';
import response from '../utils/responseHandler.js';



export const authMiddleware = (req,res,next)=>{
    const authToken = req.cookies?.auth_token;
    if(!authToken) return response(res,"Please Enter the auth token",401);
    try {
        const decode = jwt.verify(authToken,process.env.JWT_SECRET);
        req.user = decode;
        console.log(req.user);
        next(); 
    } catch (error) {
        console.error(error);
        return response(res,"Invalid or expired token",401)
    }

}
