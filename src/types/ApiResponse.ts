// 7. type of apiresponse
import { Message } from "@/model/User";

export interface ApiResponse{
    success: boolean,
    message: string,
    isAcceptingMessages?: boolean,
    messages?: Array<Message>
}