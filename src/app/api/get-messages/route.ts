import DBConnect from "@/lib/dbConnect";
import UserModel from "@/models/user";
import mongoose from "mongoose";
import { User, getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";

export async function GET(request:Request){
    await DBConnect();
    const session =  await getServerSession(authOptions)
    const user:User = session?.user as User

    if( !session || !session.user){
        return Response.json({
            success:false,
            message:"Authorization Error"
        },{status:401})
    }
    //aggregation ke time issue ate hai thats why we use this
  const userId =  new mongoose.Types.ObjectId(user._id)
  try {
    const user =  await UserModel.aggregate(
        [
            {
               $match:{id:userId} 
            },
            {
                $unwind:'$messages'
            },
            {
                $sort:{'messages.createdAt':-1}
            },
            {
                $group:{
                    _id:'$_id',
                    messages:{$push:'$messages'}
                }
            }   
            
        ]
    )
    if(!user || user.length === 0){
        return Response.json({
            success:false,
            message:"User Not Found ❌"
        },{status:401})
    }
    return Response.json({
        success:true,
        messages:user[0].messages
    },{status:200})
  } catch (error) {
    console.log("Failed in PipeLining 😔",error)
    return Response.json({
        success:true,
        message:"Failed in PipeLining 😔"
    },{status:404})
  }

}
