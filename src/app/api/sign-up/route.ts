// 8. signup process is done
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs"
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import { send } from "process";

export async function POST(request: Request){
    await dbConnect()

    /*
        IF existingUserByEmail EXISTS THEN
            IF existingUserByEmail.isVerified THEN
                success: false,
            ELSE
                //Save the updated user
            END IF
        ELSE
            //Create a new user with the provided details
            //Save the new user
        END IF
    */

    try {
        const{username, email, password} = await request.json()
        const existingUserVerifiedByUsername = await UserModel.findOne({
            username,
            isVerified: true
        })
        //if username exists && verified
        if(existingUserVerifiedByUsername){
            return Response.json({
                success: false,
                message: "Username is already taken"
            }, {status: 400})
        }
        //check for existing usermail and then verify it 
        const existingUserByEmail = await UserModel.findOne({email})
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString()

        //check if the user is already present
        if(existingUserByEmail){
            //check is the present user is verified
            if(existingUserByEmail.isVerified){
                return Response.json({
                    success: false,
                    message: "User already exists with this email"
                },{status: 400})
            }
            //verify the useremail
            else{
                const hashedPassword = await bcrypt.hash(password, 10);
                existingUserByEmail.password = hashedPassword;
                existingUserByEmail.verifyCode = verifyCode;
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000)
                await existingUserByEmail.save()
            }
        }//if the user is not present 
        else{
            const hashedPassword = await bcrypt.hash(password, 10);
            const expiryDate = new Date()
            expiryDate.setHours(expiryDate.getHours() + 1)

            const newUser = new UserModel({
                username, 
                email, 
                password: hashedPassword,
                verifyCode, 
                verifyCodeExpiry: expiryDate,
                isVerified: false,
                isAcceptingMessage: true,
                messages: []
            })

            await newUser.save()
        }

        //send verification email
        const emailResponse = await sendVerificationEmail(
            email,
            username,
            verifyCode
        )

        if(!emailResponse.success){
            return Response.json({
                success: false,
                message: emailResponse.message
            }, {status: 500})
        }
        return Response.json({
            success: true,
            message: "User registered successfully. Please verify your email"
        }, {status: 201})
    } catch (error) {
        console.error("Error while registering user", error)
        return Response.json(
            {
                success: false,
                message: "Error while registering user"
            },
            {
                status: 500
            }
        )
    }
}