//2. Create schemas for all then install zod
import {z} from 'zod'

export const usernameValidation = z
    .string()
    .min(2, 'Username must be of atleast 2 characters')
    .max(12, 'Username must not be greater than 12 characters')
    .regex(/^[a-zA-Z0-9]+$/, 'Username must not contain any special characters') //regex to check for username doesn't contain special character

export const signUpSchema = z.object({
    username: usernameValidation,
    email: z.string().email({message: 'Invalid email id'}),
    password: z.string().min(6, {message: 'Password must be atleast 6 characters'})
})