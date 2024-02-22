import { SQLiteDatabase, openDatabase } from "expo-sqlite";
import { User } from "../types/auth";
import { Message } from "../types/chat";
import _ from "lodash";

type schemes = "users" | "messages";

class Database {
  db: SQLiteDatabase | null = null;

  constructor() {
    this.init();
  }

  async init() {
    this.db = openDatabase("test.db");
    this.createTables();
  }

  createTables() {
    this.db?.transaction((tx) => {
      tx.executeSql(`
            PRAGMA foreign_keys = ON;

            CREATE TABLE IF NOT EXISTS users (
                address TEXT PRIMARY KEY,
                displayName TEXT,
                publicKey TEXT NOT NULL,
                created TEXT DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS messages (
                id TEXT PRIMARY KEY,
                sender TEXT NOT NULL,
                receiver TEXT NOT NULL,
                content TEXT NOT NULL,
                timestamp TEXT DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (sender) REFERENCES users(address) ON DELETE CASCADE ON UPDATE RESTRICT,
                FOREIGN KEY (receiver) REFERENCES users(address) ON DELETE CASCADE ON UPDATE RESTRICT,
          )

          `);
    });
    // CREATE TRIGGER IF NOT EXISTS delete_user_trigger AFTER DELETE ON users BEGIN DELETE FROM messages WHERE sender = old.address OR receiver = old.address
  }

  async fetchAll<T>(table: schemes) {
    let results: T[] = [];

    await this.db?.transactionAsync(async (tx) => {
      results = (await tx.executeSqlAsync(`SELECT * FROM ${table}`))
        .rows as T[];
    }, true);
    return results;
  }

  async insertUsers(users: User[]) {
    this.db?.transaction((tx) => {
      _.forEach(users, (user) => {
        tx.executeSql(
          "INSERT OR REPLACE INTO users (address, displayName, publicKey) VALUES (?, ?, ?)",
          [user.address, user.displayName || "", user.publicKey]
        );
      });
    });
  }

  async deleteUsers(users: User[]) {
    this.db?.transaction((tx) => {
      _.forEach(users, (user) => {
        tx.executeSql("DELETE FROM users WHERE address = ?", [user.address]);
      });
    });
  }

  async insertMessages(messages: Message[]) {
    this.db?.transaction((tx) => {
      _.forEach(messages, (message) => {
        tx.executeSql(
          "INSERT INTO messages (id, sender, receiver, content) VALUES (?, ?, ?, ?)",
          [
            message.id,
            message.sender.address,
            message.receiver.address,
            message.content,
          ]
        );
        console.log(message);
        
      });
    });
  }

  async deleteMessages(messages: Message[]) {
    this.db?.transaction((tx) => {
      _.forEach(messages, (message) => {
        tx.executeSql("DELETE FROM messages WHERE id = ?", [message.id]);
      });
    });
  }
}

export default new Database();
