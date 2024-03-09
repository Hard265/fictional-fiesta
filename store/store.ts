import { action, makeObservable, observable } from "mobx";
import { User } from "../types/auth";
import _ from "lodash";
import { Message } from "../types/chat";
import { SQLiteDatabase } from "expo-sqlite/next";


class Store {
    users: User[] = [];
    messages: {
        [key: string]: Message[];
    } = {};


    constructor() {
        makeObservable(this, {
            users: observable,
            messages: observable,
            addUsers: action,
            removeUsers: action,
            addMessages: action,
            removeMessage: action,
            middleWare:action
        })
        
    }

    // Method to add users and persist them in the database
    async addUsers(db:SQLiteDatabase ,users: User[]) {
        try {
            // For inserting multiple users at once
            const placeholders = Array(users.length).fill('(?, ?, ?)').join(',');
            const values = _.flatMap(users, user => [user.address, user.displayName || '', user.publicKey]);

            await db.runAsync(
              `INSERT OR IGNORE INTO users (address, displayName, publicKey) VALUES ${placeholders}`,
              values
            );
            // After inserting all users successfully, update the MobX store
            this.middleWare(()=>this.users = _.unionBy(users, this.users, "address"));
        } catch (error) {
            console.error("Error database", error);
        }
    }

    // Method to remove users and update the database accordingly
    async removeUsers(db:SQLiteDatabase,users: User[]) {
        try {
            const placeholders = Array(users.length).fill('?').join(',');
            const addresses = users.map(user => user.address);

            await db.runAsync(
              `DELETE FROM users WHERE address IN (${placeholders})`,
              addresses
            );
            // After removing the users successfully, update the MobX store
            this.middleWare(()=>this.users = _.differenceBy(this.users, users, "address"));
        } catch (error) {
            console.error("Error database", error);
        }
    }

    // Method to add messages and persist them in the database
    async addMessages(db:SQLiteDatabase, messages: Message[], admin: string) {
        try {
            // For inserting multiple messages at once
            const placeholders = Array(messages.length).fill('(?, ?, ?, ?, ?)').join(',');
            const values = _.flatMap(messages, message => [message.id, message.sender, message.receiver, message.content, message.timestamp]);

            await db.runAsync(
              `INSERT OR IGNORE INTO messages (id, sender, receiver, content, timestamp) VALUES ${placeholders}`,
              values
            );
         this.middleWare(()=>
            this.messages = _.mergeWith( _.groupBy(messages, (message) => message.sender === admin ? message.receiver : message.sender),this.messages, (objValue: Message[], srcValue: Message[]) => {
              if (_.isArray(objValue)) {
                return _.unionBy(objValue, srcValue, "id");
              }
            }));
         } catch (error){
            console.error("Error database", error);
         }
    }

    async removeMessage(message: Message, addressUser: string) {
        this.middleWare(()=>this.messages[addressUser] = _.without(this.messages[addressUser], message));
    }

    middleWare(callback:()=>void){
        callback();
    }
}

export default new Store();
