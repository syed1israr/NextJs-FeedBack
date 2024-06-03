
import DBConnect from "@/lib/dbConnect";
import UserModel from "@/models/user";
import { Message } from "@/models/user";


export async function POST(request:Request){
    await DBConnect();
    const { username , content} = await request.json()
    try {
        const user = await UserModel.findOne({username})
        if(!user){
            return Response.json({
                success:false,
                message:"User Not found ❌"
            },{status:404})
        }
        //is user Accepting the Messages ... ?
        if(!user.isAcceptingMessage){
            return Response.json({
                success:false,
                message:"User Not Accepting the Message ❌"
            },{status:404})
        }
        const newMessage =  { content , createdAt:new Date()}
            //typescript issue so we excplicty mentioning it
            user.messages.push(newMessage as Message) 
            await user.save()
            return Response.json({
                success:true,
                message:"Message Sent Succesfully ✔️"
            },{status:404})
    } catch (error) {
        console.log("Error while adding the Messages ⚠️",error)
        return Response.json({
            success:false,
            message:"Error while adding the Messages ⚠️"
        },{status:500})
    }
}