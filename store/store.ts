import { action, makeObservable, observable } from "mobx";
import { User } from "../types/auth";
import _ from "lodash";
import { Message } from "../types/chat";


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
            removeUser: action,
            addMessages: action,
            removeMessage: action,
        })
        
    }

    addUsers(users: User[]) {
        this.users = _.unionBy(users, this.users, "address");
    }

    removeUser(user: User) {
        this.users = _.without(this.users, user);
    }

    addMessages(messages: Message[], admin: string) {
        this.messages = _.mergeWith( _.groupBy(messages, (message) => message.sender === admin ? message.receiver : message.sender),this.messages, (objValue: Message[], srcValue: Message[]) => {
            if (_.isArray(objValue)) {
                return _.unionBy(objValue, srcValue, "id");
            }
        });
    }

    removeMessage(message: Message, addressUser: string) {
        this.messages[addressUser] = _.without(this.messages[addressUser], message);
    }
}

export default new Store();


// interface StoreX {
//     chatStore: ChatStore;
//     userStore: UserStore;
// }

// class StoreX {
//     chatStore;
//     userStore;

//     constructor() {
//         this.chatStore = new ChatStore(this);
//         this.userStore = new UserStore(this);
//     }
// }




// export default new StoreX();