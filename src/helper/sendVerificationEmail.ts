import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmai";

import { APIResponse } from "@/types/APIResponse";



export async function sendVerificationEmail(
    email:string,
    username:string,
    verifyCode:string,
):Promise<APIResponse>{
    try {
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'Mystery Message | Verification Code',
            react: VerificationEmail({ username, otp: verifyCode }),
          });
        return {
            succcess:true,
            message:"Succesfully  Sent Verification Email"
        }  
    } catch (error) {
        console.error("error in sending Verification Email",error)
        return {
            succcess:false,
            message:"Failed to Send Verification Email"
        }
    }
}