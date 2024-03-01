import { SQLiteDatabase } from "expo-sqlite/next";
import { Message } from "../types/chat";
import _ from "lodash";
import { action, makeObservable, observable } from "mobx";
import store from "./store";


class ChatStore {
    chats: { [key: string]: Message[] } = {}
    errors: any[] = [];
    rootStore: typeof store;

    constructor(rootStore: typeof store) {
        makeObservable(this, {
            chats: observable,
            errors: observable,
            post: action,
            delete: action,
            init: action,
            _mediator: action
        })
        this.rootStore = rootStore;
    }

    async init(db: SQLiteDatabase, address: string) {
        try {
            const messages = await db.getAllAsync<Message>(
                "SELECT * FROM messages WHERE (sender = $address AND receiver = $admin) OR (sender = $admin AND receiver = $address)",
                { $address: address, $admin: this.rootStore.userStore.admin.address }

            );
            this._mediator(address, messages)
        } catch (error) {
            console.error("Error database", error);
        }
    }

    async post(db: SQLiteDatabase, address: string, message: Message) {
        try {
            await db.runAsync("INSERT INTO messages (id, sender, receiver, content, timestamp) VALUES ($id, $sender, $receiver, $content, $timestamp)",
                { $id: message.id, $sender: message.sender, $receiver: message.receiver, $content: message.content, $timestamp: message.timestamp }
            );
            this._mediator(address, _.unionBy(this.chats[address], [message], 'id'))
        } catch (error) {
            console.error("Error database", error);
        }
    }

    async delete(db: SQLiteDatabase, address: string, id: string) {
        try {
            await db.runAsync("DELETE FROM messages WHERE id = $id", { $id: id });
            this._mediator(address, _.filter(this.chats[address], (message) => message.id !== id))
        } catch (error) {
            console.error("Error database", error);
        }
    }

    _mediator(address: string, messages: Message[]) {
        this.chats[address] = messages
    }
}

export default ChatStore;