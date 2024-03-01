import { SQLiteDatabase } from "expo-sqlite/next";
import { User } from "../types/auth";
import store from "./store";
import { Message } from "../types/chat";

export async function databaseInitHandler(db: SQLiteDatabase) {
    db.execAsync(`
        PRAGMA journal_mode = 'wal';
        PRAGMA foreign_keys = ON;

        CREATE TABLE IF NOT EXISTS users (
            address TEXT PRIMARY KEY,
            displayName TEXT,
            publicKey TEXT NOT NULL,
            created TEXT DEFAULT CURRENT_TIMESTAMP
        );

        INSERT OR IGNORE INTO users (address, displayName, publicKey) VALUES ('ee3c5216-3152-473a-8f17-c4adf8ba7bba', 'Me', 'key');

        CREATE TABLE IF NOT EXISTS messages (
            id TEXT PRIMARY KEY,
            sender TEXT NOT NULL,
            receiver TEXT NOT NULL,
            content TEXT NOT NULL,
            timestamp TEXT DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (sender) REFERENCES users(address) ON DELETE CASCADE ON UPDATE RESTRICT,
            FOREIGN KEY (receiver) REFERENCES users(address) ON DELETE CASCADE ON UPDATE RESTRICT
        );
    `)

}


export class Database {
    // static async pushMessages(db: SQLiteDatabase, messages: Message[]) {
    //     for (const message of messages) {
    //         await db.runAsync("INSERT INTO messages (id, sender, receiver, content, timestamp) VALUES (?, ?, ?, ?, ?)", message.id, message.sender, message.receiver, message.content, message.timestamp)
    //     }
    //     store.pushMessages(messages);
    // }

    // static async pushUsers(db: SQLiteDatabase, users: User[]) {
    //     for (const user of users) {
    //         await db.runAsync("INSERT INTO users (address, displayName, publicKey) VALUES (?, ?, ?)", user.address, user.displayName || '', user.publicKey)
    //     }
    //     store.pushUsers(users);
    // }
}