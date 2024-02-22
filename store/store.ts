import { computed, observable, action, reaction } from "mobx";
import { User } from "../types/auth";
import { Message } from "../types/chat";
import { makeObservable } from "mobx";
import _ from "lodash";
import database from "./database";

class Store {
  users: User[] = [];
  messages: Message[] = [];
  scheme: "light" | "dark" | "system" = "light";

  #admin: User = {
    address: "address",
    displayName: "me",
    publicKey: "key",
  };

  constructor() {
    makeObservable(this, {
      users: observable,
      admin: computed,
      messages: observable,
      getUser: action,
      addUser: action,
      deleteUser: action,
      pushMessage: action,
      deleteMessage: action,
    });

    this.init();

    reaction(
      () => this.users,
      (users, prev) => {
        try {
          if (users.length > prev.length)
            database.insertUsers(_.difference(users, prev));
          else if (users.length < prev.length)
            database.deleteUsers(_.difference(prev, users));
          else throw new Error("Users Update Not Implemented");
        } catch (error) {
          console.error(error);
        }
      },
      { equals: _.isEqual }
    );

    reaction(
      () => this.messages,
      (messages, prev) => {
        if (messages.length > prev.length)
          database.insertMessages(_.difference(messages, prev));
        else if (messages.length < prev.length)
          database.insertMessages(_.difference(prev, messages));
        else throw new Error("Messages Update Not Implemented");
      }
    );
  }
  init() {
    database.fetchAll<User>("users").then((users) => {
      this.users = users;
    });
  }
  get admin() {
    return this.#admin;
  }

  getUser(address: string) {
    return _.find(this.users, ["address", address]);
  }

  addUser(user: User) {
    this.users = _.union(this.users, [user]);
  }

  deleteUser(user: User) {
    this.users = _.without(this.users, user);
  }

  pushMessage(message: Message) {
    this.messages = _.concat(this.messages, message);
  }

  deleteMessage(message: Message) {
    this.messages = _.without(this.messages, message);
  }
}

export default new Store();
