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
  chats: { [key: string]: Message[] } = {}

  #admin: User = {
    address: "ee3c5216-3152-473a-8f17-c4adf8ba7bba",
    displayName: "Me",
    publicKey: "key",
  };

  constructor() {
    this.init()
      .then(() => {
        makeObservable(this, {
          users: observable,
          messages: observable,
          chats: observable,
          admin: computed,
          getUser: action,
          addUser: action,
          deleteUser: action,
          pushMessage: action,
          deleteMessage: action,
        });
      })
      .finally(() => {
        reaction(
          () => this.users,
          (users, prev) => {
            if (users.length > prev.length)
              database.insertUsers(_.difference(users, prev)).then(() => {
                console.log("was added");
              });
            // else if (users.length < prev.length)
            //   database.deleteUsers(_.difference(prev, users));
            // else throw new Error("Users Update Not Implemented");
          }
        );

        reaction(
          () => this.messages,
          (messages, prev) => {
            if (messages.length > prev.length)
              database.insertMessages(_.difference(messages, prev));
            // else if (messages.length < prev.length)
            //   database.insertMessages(_.difference(prev, messages));
            // else throw new Error("Messages Update Not Implemented");
          }
        );
      });
  }
  private async init() {
    await database.fetchAll<User>("users").then((users) => {
      this.users = users;
    });

    await database.fetchAll<Message>("messages").then((messages) => {
      this.messages = messages;
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
