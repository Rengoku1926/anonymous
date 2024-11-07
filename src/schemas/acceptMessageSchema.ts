//2. Create schemas for all then install zod
import {z} from 'zod'

export const AcceptMessageSchema = z.object({
    acceptMessages: z.boolean(),
})