import { usernameValidation } from "@/Schemas/signupSchema";
import DBConnect from "@/lib/dbConnect";
import UserModel from "@/models/user";
import { z } from "zod";


export async function POST(request:Request){
    await DBConnect();
    try {
        const { username , code } = await request.json()
        
        const user = await UserModel.findOne({username})
        if(!user){
            return Response.json({
                success:false,
                message:"User Not Found"
            },{status:404})
        }

        const isCodeValid = user.verifyCode === code
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date()

        if(isCodeValid && isCodeNotExpired){
            user.isVerified =  true 
            await user.save()
            return Response.json({
                success:true,
                message:"Account Verified Succesfully ✅"
            },{status:404})
        }else if(!isCodeNotExpired){
            return Response.json({
                success:false,
                message:"Verification Code is Expired 🤮, Sign-up Again 🤬"
            },{status:400})
        }else{
            return Response.json({
                success:false,
                message:"Verification Code is Wrong 😒, Sign-up Again 🤬"
            },{status:400}) 
        }


    } catch (error) {
        console.log("Error while verifying Code",error);
        return Response.json({
            success:false,
            message:"Error while verifying Code"
        },{status:500})
    }
}