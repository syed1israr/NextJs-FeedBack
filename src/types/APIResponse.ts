
import { Message } from "@/models/user";

export interface APIResponse{
    succcess: boolean;
    message: string;
    isAcceptingMessages?: boolean;
    messages?: Array<Message>
}