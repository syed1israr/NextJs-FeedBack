import { z } from "zod"

const usernameRegex = /^[a-zA-Z0-9_-]{3,16}$/;
export const usernameValidation = z
    .string()
    .min(2,"Username must be greater than 2 words")
    .max(20,"username must be no more than 20 words")
    .regex(usernameRegex,"username must not contain a special character")




    export const signUpschema=z.object({
        username:usernameValidation,
        email:z.string().email({message:"invalid Email Address"}),
        password:z.string().min(8,{message:"password must be atleast 8 characters"})
        
    })