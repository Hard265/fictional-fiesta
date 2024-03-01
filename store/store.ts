import { action, makeObservable, observable } from "mobx";
import { User } from "../types/auth";
import _ from "lodash";
import { Message } from "../types/chat";
import ChatStore from "./chats";
import UserStore from "./user";


interface Store {
    chatStore: ChatStore;
    userStore: UserStore;
}

class Store {
    chatStore;
    userStore;

    constructor() {
        this.chatStore = new ChatStore(this);
        this.userStore = new UserStore(this);
    }
}

// class Store {
//     users: User[] = [];
//     messages: Message[] = [];

//     admin: User = {
//         address: 'ee3c5216-3152-473a-8f17-c4adf8ba7bba',
//         displayName: 'Me',
//         publicKey: 'key'
//     }

//     constructor() {
//         makeObservable(this, {
//             users: observable,
//             messages: observable,
//             pushUsers: action,
//             sliceUsers: action,
//             pushMessages: action,
//             sliceMessages: action
//         })
//     }

//     pushUsers(users:User[]){
//         this.users = _.uniqBy(_.concat(this.users,  users), 'address');
//     }

//     sliceUsers(users:User[]){
//         this.users = _.difference(this.users, users)
//     }

//     pushMessages(messages: Message[]){
//          this.messages = _.uniqBy(_.concat(this.messages, messages), 'id');
//     }

//     sliceMessages(messages:Message[]){
//         this.messages = _.difference(this.messages, messages)
//     }
// }

export default new Store();