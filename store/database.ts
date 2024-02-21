import { SQLiteDatabase } from "expo-sqlite/next";
import { User } from "../types/auth";
import { Message } from "../types/chat";

class Database {
    constructor() {

    }

    async insertUsers(users: User[]) {
        console.log('insert users:', users);

    }

    async deleteUsers(users: User[]) {
        console.log('delete users:', users);

    }

    async insertMessages(messages: Message[]) {
        console.log('insert messages:', messages);

    }

    async deleteMessages(messages: Message[]) {
        console.log('delete messages:', messages);

    }
}

export default new Database();