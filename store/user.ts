import { action, makeObservable, observable } from "mobx";
import { User } from "../types/auth";
import Store from './store';
import { SQLiteDatabase } from "expo-sqlite/next";
import _ from "lodash";


class UserStore {
    rootStore: typeof Store;
    users: User[] = []

    constructor(rootStore: typeof Store) {
        this.rootStore = rootStore;
        makeObservable(this, {
            users: observable,
            init: action,
            _mediator: action,
            post: action,
            delete: action,
        })
    }

    async init(db: SQLiteDatabase) {
        try {
            const results = await db.getAllAsync<User>("SELECT * FROM users");
            this._mediator(results)
        } catch (error) {
            console.error("Error database", error);
        }
    }


    async post(db: SQLiteDatabase, user: User) {
        try {
            await db.runAsync("INSERT INTO users (address, displayName, publicKey) VALUES ($address, $displayName, $publicKey)",
                { $address: user.address, $displayName: user.displayName || '', $publicKey: user.publicKey }
            );
            this._mediator(_.unionBy(this.users, [user], 'address'))
        } catch (error) {
            console.error("Error database", error);
        }
    }

    async delete(db: SQLiteDatabase, address: string,) {
        try {
            await db.runAsync("DELETE FROM users WHERE address = $address", { $address: address });
            this._mediator(_.filter(this.users, (user) => user.address !== address))
        } catch (error) {
            console.error("Error database", error);
        }
    }

    _mediator(users: User[]) {
        this.users = users;
    }
}

export default UserStore;