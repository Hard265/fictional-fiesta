import { SQLiteDatabase, openDatabaseAsync } from "expo-sqlite/next";
import { User } from "../types/auth";
import { Message } from "../types/chat";
import _ from "lodash";

type schemes = "users" | "messages";

class Database {
  private db: SQLiteDatabase | null = null;

  constructor() {
    this.init();
  }

  private async init() {
    this.db = await openDatabaseAsync('test_2.db');
    await this.createTables();
  }

  private async createTables() {
    if (!this.db) return;
    await this.db.execAsync(`
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
        );
    `);
  }

  async fetchAll<T>(table: schemes): Promise<T[]> {
    return this.db ? await this.db.getAllAsync(`SELECT * FROM ${table}`) : [];
  }

  async insertUsers(users: User[]) {
    if (!this.db) return [];
    for (const user of users) {
      await this.db?.runAsync("INSERT OR REPLACE INTO users (address, displayName, publicKey) VALUES (?, ?, ?)", [user.address, user.displayName || "", user.publicKey]);
    }
  }

  async deleteUsers(users: User[]) {
    if (!this.db) return [];

    for (const user of users) {
      await this.db?.runAsync("DELETE FROM users WHERE address = ?", [user.address]);
    };
  }

  async insertMessages(messages: Message[]) {
    if (!this.db) return [];

    for (const message of messages) {
      await this.db?.runAsync(
        "INSERT INTO messages (id, sender, receiver, content) VALUES (?, ?, ?, ?)",
        [
          message.id,
          message.sender.address,
          message.receiver.address,
          message.content,
        ]
      );
    }
  }

  async deleteMessages(messages: Message[]) {
    if (!this.db) return [];
    for (const message of messages) {
      await this.db?.runAsync("DELETE FROM messages WHERE id = ?", [message.id]);
    }
  }
}

export default new Database();
