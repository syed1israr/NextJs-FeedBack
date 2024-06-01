import { usernameValidation } from "@/Schemas/signupSchema";
import DBConnect from "@/lib/dbConnect";
import UserModel from "@/models/user";
import { z } from "zod";


const UsernameQuerySchema = z.object({
    username:usernameValidation
})



export async function GET(request:Request){
      
    await DBConnect();
    try {
        
        const { searchParams } = new URL(request.url)
        const quereyParam={
            username:searchParams.get('username')
        }
        const result = UsernameQuerySchema.safeParse(quereyParam)
        console.log("Result",result) 
        if(!result.success){
            const usernameErrors = result.error.format().username?._errors || [];
            return Response.json({
                success:false,
                message:usernameErrors.length >0? usernameErrors.join(' ,'):"invalid Query Paramter"
            },{status:200})
        }

        const { username }=result.data;
        const existingVerifiedUser = await UserModel.findOne({username , isVerified:true});
        if(existingVerifiedUser){
            return Response.json({
                success:false,
                message:"Username Already Taken"
            },{status:500})
        }else{
            return Response.json({
                success:true,
                message:"Username is Available"
            },{status:201})
        }
    } catch (error) {
        console.log("Error while checking Usernam",error)
        return Response.json({
            success:false,
            message:"Error Checking Username"
        },{status:500})
    }
}