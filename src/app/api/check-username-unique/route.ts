import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import {z} from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";

const UserNameQuerySchema = z.object({
    username: usernameValidation
   
})

export async function GET(request: Request){
    //we can also use this in all other routes
    await dbConnect()
    console.log(`Received request with method : ${request.method}`);
    if(request.method !== 'GET'){
        return Response.json({
            success: false,
            message: 'Method not allowed',
        },{status: 405})
    }

    try {
        const {searchParams} = new URL(request.url)
        const queryParam = {
            username: searchParams.get('username')
        }
        //validation with zod
        const result = UserNameQuerySchema.safeParse(queryParam)
        console.log(result)
        if(!result.success){
            const usernameErrors = result.error.format().
            username?._errors || []
            return Response.json({
                success: false,
                message: usernameErrors?.length > 0? usernameErrors.join(', ') : 'Invalid query parameters'
            }, {status: 400})
        }
        const {username} = result.data

        const existingVerifiedUser = await UserModel.findOne({username, isVerified: true})

        if(existingVerifiedUser){
            return Response.json({
                success: false,
                message: 'Username is already taken',
            },{status: 400})
        }
        return Response.json({
            success: true,
            message: 'Username is available',
        },{status: 400}) 

    } catch (error) {
        console.log("Error checking username", error)
        return Response.json(
        {
            success: false,
            message: "Error checking username"
        },
        { status : 500 }
    )
    }
}