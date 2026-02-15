const express = require("express")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const User = require("../models/User")

const router = express.Router();

// REGISTER 

router.post("/register", async(request, response)=>{
    const {name, email, password} = request.body

    try{
    const existingUser = await User.findOne({email})
        if(existingUser){
            return response.status(400).json({message: "User already exists"})
        }
         const hashedPassword = await bcrypt.hash(password, 10)

         await User.create({
            name,
            email,
            password: hashedPassword
         })

         response.status(201).json({message: "User registered Successfully"})
    }catch(err){
        console.log(err)
        response.status(500).json({message: "Server Error"})
    }
})

// LOGIN 

router.post("/login", async(request, response)=>{
    const {email, password} = request.body

    try{
        const user = await User.findOne({email})
        if(!user){
            return response.status(400).json({message: "Invalid credentials"})
        }
        
        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch){
            return response.status(400).json({message: "Invalid credentials"})
        }
        
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: "7d"})
        response.json({token, user:{id: user._id, name:user.name,email:user.email}})
    }catch(err){
        console.log(err)
        response.status(500).json({message: "Server Error"})
    }
});

module.exports = router