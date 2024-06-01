import { sendVerificationEmail } from "@/helper/sendVerificationEmail";
import DBConnect from "@/lib/dbConnect";
import UserModel from "@/models/user";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
    await DBConnect();
    
    try {
        const { username, email, password } = await request.json();

        
        const existingUserVerifiedByUsername = await UserModel.findOne({ username, isVerified: true });
        if (existingUserVerifiedByUsername) {
            return Response.json({
                success: false,
                message: "Username Is Already Taken"
            }, { status: 400 });
        }

       
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
        const existingUserByEmail = await UserModel.findOne({ email });

        if (existingUserByEmail) {
            if (existingUserByEmail.isVerified) {
                return Response.json({
                    success: false,
                    message: "User already exists with this Email!"
                }, { status: 400 });
            } else {
                
                existingUserByEmail.password = await bcrypt.hash(password, 10);
                existingUserByEmail.verifyCode = verifyCode;
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000); // 1 hour from now
                await existingUserByEmail.save();
            }
        } else {
            
            const hashedPassword = await bcrypt.hash(password, 10);
            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + 1);

            const newUser = new UserModel({
                username,
                email,
                password: hashedPassword,
                verifyCode,
                verifyCodeExpiry: expiryDate,
                isAcceptingMessage: true,
                messages: []
            });

            await newUser.save();
        }

        // Send verification email
        const emailResponse = await sendVerificationEmail(email, username, verifyCode);
        if (!emailResponse.success) {
            return Response.json({
                success: false,
                message: emailResponse.message
            }, { status: 500 });
        }

        return Response.json({
            success: true,
            message: "User registered successfully. Please verify your email."
        }, { status: 201 });

    } catch (error) {
        console.error("Error registering user", error);
        return Response.json({
            success: false,
            message: "Error registering user!"
        }, { status: 500 });
    }
}
