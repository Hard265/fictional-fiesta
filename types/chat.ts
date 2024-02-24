import { User } from "./auth";

type Message = {
    id: string;
    timestamp: string;
    sender: string;
    receiver: string;
    content: string;
}

export { Message }