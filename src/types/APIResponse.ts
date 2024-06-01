
import { Message } from "@/models/user";

export interface APIResponse{
    success: boolean;
    message: string;
    isAcceptingMessages?: boolean;
    messages?: Array<Message>
}