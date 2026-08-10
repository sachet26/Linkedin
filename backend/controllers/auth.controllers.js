import User from "../models/user.model.js";
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import genToken from "../config/auth.js";
export const signup = async(req, res)=>{
    try{
    const {firstName, lastName, userName, email, password} = req.body;
    const existUser = await User.findOne({userName})
    if(existUser){
        
        return res.status(400).json({message: "user already exist !"})
    }
    const existEmail = await User.findOne({email})
    if(existEmail){
        return res.status(400).json({message: "email already exist !"})
    }
    const hassedPassword = await bcrypt.hash(password, 10)
    const user = await User.create({
       firstName, 
       lastName, 
       userName, 
       email, 
       password : hassedPassword
    })
    let token = await genToken(user._id)
    res.cookie("token", token, {
        httpOnly : true,
        maxAge: 7*24*60*60*1000,
        sameSite:"none",
        secure:process.env.NODE_ENVIRONMENT === "production"
    })
    return res.status(201).json(user)
    }
    catch(error){
        console.log(error)
    return res.status(500).json({message:"error"})
    
    }
} 

export const login = async(req, res)=>{
    try{
    const {email, password} = req.body;
    const user = await User.findOne({email})
    if(!user){
        return res.status(400).json({message: "user does not exist !"})
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if(!isMatch){
        return res.status(400).json({message: "incorrect password !"})
    }
    
    let token = await genToken(user._id)
    res.cookie("token", token, {
        httpOnly : true,
        maxAge: 7*24*60*60*1000,
        sameSite:"strict",
        secure:process.env.NODE_ENVIRONMENT === "production"
    })
    return res.status(201).json(user)
    }
    catch(error){
        console.log(error)
    return res.status(500).json({message:"error"})
    
    }
} 

export const logOut = async(req, res) => {
      try{
        
       res.clearCookie("token")
       return res.status(200).json({message:"logout successfully"})
      }
      catch(error){
       
    return res.status(500).json({message:"error"}) 
      }
}
