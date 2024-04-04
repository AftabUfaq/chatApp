

const combineData = (friendAvatar, sortedLastMessage) => {
  if (!sortedLastMessage) {
    return [];
  }

  return friendAvatar.map((friend) => {
    const lastMessageData = sortedLastMessage.find((chat) =>
      chat.chatters.includes(friend.name)
    );
    return {
      ...friend,
      lastMessage: lastMessageData ? lastMessageData.message : "",
    };
  });
}; 

function processAuthError(authError) {
  if (authError.message.includes("user-not-found")) {
    Alert.Alert("The user do not exist, please register")
  }
  if (authError.message.includes("wrong-password")) {
    Alert.Alert("The passwort is not correct . Please try again");
  }
  if (authError.message.includes("email-already-in-use")) {
    Alert.Alert("The Email is already in use");
  }
  if (authError.message.includes("invalid-email")) {
    Alert.Alert("The Email is not correct");
  }
}


export { combineData,processAuthError };