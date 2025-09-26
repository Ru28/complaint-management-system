import bcryptjs from "bcryptjs";
import User from "../models/userSchema";
import { generateToken } from "../services/accountService";

export const signup = async(req:any, res:any) => {
   try {
    const {fullName,email,phoneNumber,password,role} =req.body;
    if(!fullName || !email || !phoneNumber || !password || !role){
        return res.status(400).json({success: false, message: "All Fields are required"});
    }
 
    // check if user already exist
    const existingUser = await User.findOne({
        $or: [{email},{phoneNumber}]
    });

    if(existingUser){
        return res.status(409).json({
            message: "User already exist with email and Phone Number"
        });
    }

    // hashpassword 
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword=await bcryptjs.hash(password,salt);

    const newUser= new User({
        fullName,
        email,
        phoneNumber,
        role,
        password:hashedPassword,
    });

    await newUser.save();
    console.log(newUser);
    const token = generateToken(newUser);
    return res.status(201).json({success:true, 
        user:{
            id: newUser._id,
            email: newUser.email,
            phoneNumber: newUser.phoneNumber,
            role: newUser.role
        },
        token
    })
    
   } catch (error) {
     console.error("Signing error:",error);
     return res.status(500).json({success:false, message: "internal sever error"});
   }
};

export const login = async(req:any, res:any) => {
    try {
        const {email,phoneNumber,password} = req.body;

        // either require email OR phoneNumber
        if((!email && !phoneNumber) || !password){
            return res.status(400).json({success:false, message: "Email or PhoneNumber and password are required"});
        }

        const user = await User.findOne({
            $or:[{email},{phoneNumber}]
        });

        if(!user){
            return res.status(401).json({success: false, message: "Invalid Credential"});
        }

        // compare password
        const isMatch = await bcryptjs.compare(password,user.password);
        if(!isMatch){
            return res.status(401).json({success: false, message: "Invalid Credential"});
        }

        const token= generateToken(user);

        return res.status(200).json({
            success:true,
            user:{
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                phoneNumber: user.phoneNumber,
                role: user.role,
            },
            token
        })
        
    } catch (error) {
        console.error("Login error:", error);
        return res
        .status(500).json({ success: false, message: "Internal server error" });
    }
}