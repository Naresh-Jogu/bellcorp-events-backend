const { response } = require("express");
const jwt = require("jsonwebtoken")

const authMiddleware = (request, response, next)=>{
    const authHeader = request.headers.authorization
    if(!authHeader || !authHeader.startsWith("Bearer ")){
        return response.status(401).json({message: "Not authorized"})
    }

    const token = authHeader.split(" ")[1];

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        request.user = decoded // {id: userId}
        next();
    }catch(err){
        return response.status(401).json({message: "Invalid token"})
    }

};

module.exports = authMiddleware