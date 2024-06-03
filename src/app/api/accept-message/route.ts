import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import DBConnect from "@/lib/dbConnect";
import UserModel from "@/models/user";
import { User } from "next-auth"

export async function POST(request:Request){
    await DBConnect();

    const session =  await getServerSession(authOptions)
    const user:User = session?.user as User

    if( !session || !session.user){
        return Response.json({
            success:false,
            message:"Authorization Error"
        },{status:401})
    }
  const userId =  user._id
  const { acceptMessages } = await request.json()

  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
        userId,
        {isAcceptingMessage:acceptMessages},
        {new:true}
    )
    if(!updatedUser){
        return Response.json({
            success:false,
            message:"Requested User Not found ❌"
        },{status:404})
    }
    return Response.json({
        success:true,
        user:updatedUser,
        message:"Message Acceptance Status Updated Succesfully ✅"
    },{status:201})
    
  } catch (error) {
    console.log("Failed To update user Status to Accept Messages 😔")
    return Response.json({
        success:false,
        message:"Failed To update user Status to Accept Messages 😔"
    },{status:500})
  }
}

export async function GET(req:Request){
    await DBConnect();

    const session =  await getServerSession(authOptions)
    const user:User = session?.user as User

    if( !session || !session.user){
        return Response.json({
            success:false,
            message:"Authorization Error ⚠️"
        },{status:401})
    }
  const userId =  user._id
  
 try {
     const foundUser = await UserModel.findById(userId)
     
     if(!foundUser){
       return Response.json({
           success:false,
           message:"Requested User Not found ❌"
           },{status:404})
       }
       return Response.json({
           success:true,
           isAcceptingMessages:foundUser.isAcceptingMessage
           },{status:200})
 } catch (error) {
    console.log("Error in Getting Message Acceptance Status 😔",error)
    return Response.json({
        success:false,
        message:"Error in Getting Message Acceptance Status 😔"
        },{status:500})
 }

}

//Aggregation PipeLining



