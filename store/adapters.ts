export function onUserListItemRender(user:User){
  const is_empty = _.isEmpty(store.chats[user.address]);
  if(is_empty){
    store.fetchLastMessage(user);
  }
}


export function onChatRetrieve(user:User){
  const is_empty = _.isEmpty(store.chats[user.address])
  if(is_empty){
    store.fetchChat(user);
  }
}