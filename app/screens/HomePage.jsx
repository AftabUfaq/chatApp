import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  Image,
  ActivityIndicator,
  FlatList,
} from "react-native";
import React, { useEffect, useLayoutEffect, useContext, useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase/config";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";
import { UserRef } from "../../firebase/config";
import { Ionicons } from "@expo/vector-icons";
import { db } from "../../firebase/config";
import {
  QuerySnapshot,
  collection,
  doc,
  getDocs,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
const chatRef = collection(db, "chats");
import ChatItem from "../component/ChatItem";
import { AuthenticatedUserContext } from "../../Service/AuthContext";
import { combineData } from "../Utils";

const HomePage = () => {
  const navigation = useNavigation();
  const { user, userAvatarUrl, setUserAvatarUrl } = useContext(
    AuthenticatedUserContext
  );
  const [isLoading, setIsLoading] = useState(false);

  const username = user.email.split("@")[0];
  const [friends, setFriends] = useState([]);
  const [lastMessage, setLastMessage] = useState([]);
  const [friendAvatar, setFriendAvatar] = useState([]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={() => navigation.navigate("profil")}>
          {!userAvatarUrl ? (
            <FontAwesome
              name="user-circle"
              size={24}
              color="white"
            />
          ) : (
            <Image
              source={{ uri: userAvatarUrl }}
              className=" h-12 w-12 rounded-full"
            />
          )}
        </TouchableOpacity>
      ),
    });
  });

  const queryResult = query(UserRef, where("email", "==", user.email));

  useEffect(() => {
    if (!user) return;
    async function DocFinder(queryResult) {
      const querySnapshot = await getDocs(queryResult);
      querySnapshot.forEach((doc) => {
        const { image } = doc.data();
        setUserAvatarUrl(image);
      });
    }
    DocFinder(queryResult)
  },[]);

  useEffect(() => {
    if (!user) return;

    const FetchLoggedInUserFriend = async () => {
      setIsLoading(true);
      const queryResult1 = query(
        chatRef,
        where('chatters', '>=', `${username}`),
        where('chatters', '<=', `${username}` + "\uf8ff")
      );
      const queryResult2 = query(
        chatRef,
        where('chatters', '<=', `_to_${username}`)
      );

      let friendsArray = [];

      const unsubscribe1 = onSnapshot(queryResult1, (querySnapshot) => {
        setIsLoading(false);
        querySnapshot.forEach((document) => {
          if (document.data().chatters.includes(username)) {
            const chats = document.data().chatters;
            const friends = chats.replace(username, "").replace("_to_", "");
            friendsArray.push(friends);
            friendsArray = [...new Set(friendsArray)];
            setFriends(friendsArray);
          }
        });
      });

      const unsubscribe2 = onSnapshot(queryResult2, (querySnapshot) => {
        setIsLoading(false);
        querySnapshot.forEach((document) => {
          if (document.data().chatters.includes(username)) {
            const chats = document.data().chatters;
            const friends = chats.replace(username, "").replace("_to_", "");
            friendsArray.push(friends);
            friendsArray = [...new Set(friendsArray)];
            setFriends(friendsArray);
          }
        });
      });
      return () => {
        unsubscribe1, unsubscribe2;
      };
    };
    FetchLoggedInUserFriend();
  }, []);

  console.log("liste amis", JSON.stringify(friends))
  useEffect(() => {
    if (!user) {
      console.log("aucun user");
      return;
    }

    let avartarArray = [];
    let latestMessage = [];

    const unsubscribe = friends.map((friend) => {
      const queryResult1 = query(UserRef, where("username", "==", friend));
      const unsubFriend = onSnapshot(queryResult1, (querySnapshot) => {
        querySnapshot.forEach((document) => {
          const { profilePic } = document.data();
          avartarArray.push({ name: friend, avatar: profilePic });
          setFriendAvatar([...avartarArray]); // a verifier le set
        });
      });

      const queryResult2 = query(
        chatRef,
        where("chatters", "==", `${username}_to_${friend}`)
      );
      const queryResult3 = query(
        chatRef,
        where("chatters", "==", `${friend}_to_${username}`)
      );

      const unSubChat1 = onSnapshot(queryResult2, (querySnapshot) => {
        querySnapshot.forEach((document) => {
          conversation = document.data().conversation;
          console.log("Conversation:", conversation);
          let lastMessage = [];
          if (conversation && conversation.length > 0) {
          //  console.log("Document found for friend:", friend);
          //  lastMessage = [conversation.pop()];

            lastMessage = [conversation[conversation.length - 1]]
          }
          latestMessage.push({
            chatters: document.data().chatters,
            message: lastMessage,
          });
          setLastMessage([...latestMessage]);
        });
      });

      const unSubChat2 = onSnapshot(queryResult3, (querySnapshot) => {
        querySnapshot.forEach((document) => {
          conversation = document.data().conversation;
          let lastMessage = [];
          if (conversation && conversation.length > 0) {
            //lastMessage =[conversation.pop()]

            lastMessage = [conversation[conversation.length - 1]];
          }
          latestMessage.push({
            chatters: document.data().chatters,
            message: lastMessage,
          });
          setLastMessage([...latestMessage]);
        });
      });
      return () => {
        unsubFriend();
        unSubChat1();
        unSubChat2();
      };
    });
    return () => unsubscribe.forEach((unsub) => unsub());
  }, [friends]);

  // useEffect(() => {
  //   if (!user) {
  //     console.log("Aucun utilisateur connecté");
  //     return;
  //   }

  //   let avartarArray = [];
  //   let latestMessage = [];

  //   const unsubscribe = friends.map((friend) => {
  //     const queryResult1 = query(UserRef, where("userName", "==", friend));
  //     const unsubFriend = onSnapshot(queryResult1, (querySnapshot) => {
  //       querySnapshot.forEach((document) => {
  //         const { profilePic } = document.data();
  //         avartarArray.push({ name: friend, avatar: profilePic });
  //         setFriendAvatar([...avartarArray]); // Vérifiez si vous obtenez les avatars correctement
  //       });
  //     });

  //     const queryResult2 = query(
  //       chatRef,
  //       where("chatters", "==", ` ${userName}_to_${friend}`)
  //     );
  //     const queryResult3 = query(
  //       chatRef,
  //       where("chatters", "==", ` ${friend}_to_${userName}`)
  //     );

  //     const unSubChat1 = onSnapshot(queryResult2, (querySnapshot) => {
  //       querySnapshot.forEach((document) => {
  //         console.log("Document found for friend:", friend);
  //         const conversation = document.data().conversation;
  //         console.log("Conversation:", conversation);
  //         if (conversation && conversation.length > 0) {
  //           console.log("Messages found in conversation:", conversation.length);
  //           const lastMessage = conversation[conversation.length - 1]; // Récupération du dernier message
  //           console.log("Last message:", lastMessage);
  //           latestMessage.push({
  //             chatters: document.data().chatters,
  //             message: lastMessage,
  //           });
  //           setLastMessage([...latestMessage]);
  //         } else {
  //           console.log(
  //             "No messages found in conversation with friend:",
  //             friend
  //           );
  //         }
  //       });
  //     });

  //     const unSubChat2 = onSnapshot(queryResult3, (querySnapshot) => {
  //       querySnapshot.forEach((document) => {
  //         console.log("Document found for friend:", friend);
  //         const conversation = document.data().conversation;
  //         console.log("Conversation:", conversation);
  //         if (conversation && conversation.length > 0) {
  //           console.log("Messages found in conversation:", conversation.length);
  //           const lastMessage = conversation[conversation.length - 1]; // Récupération du dernier message
  //           console.log("Last message:", lastMessage);
  //           latestMessage.push({
  //             chatters: document.data().chatters,
  //             message: lastMessage,
  //           });
  //           setLastMessage([...latestMessage]);
  //         } else {
  //           console.log(
  //             "No messages found in conversation with friend:",
  //             friend
  //           );
  //         }
  //       });
  //     });

  //     return () => {
  //       unsubFriend();
  //       unSubChat1();
  //       unSubChat2();
  //     };
  //   });

  //   return () => unsubscribe.forEach((unsub) => unsub());
  // }, [friends]);

  // useEffect(() => {
  //   if (!user) {
  //     console.log("Aucun utilisateur connecté");
  //     return;
  //   }

  //   let avatarArray = [];
  //   let latestMessage = [];

  //   const unsubscribe = friends.map((friend) => {
  //     const queryResult1 = query(UserRef, where('username', '==', friend));
  //     const unsubFriend = onSnapshot(queryResult1, (querySnapshot) => {
  //       querySnapshot.forEach((document) => {
  //         const { profilePic } = document.data();
  //         avatarArray.push({ name: friend, avatar: profilePic });
  //         console.log("Avatar trouvé pour ami :", friend);
  //         console.log("Avatar :", profilePic);
  //         setFriendAvatar([...avatarArray]);
  //       });
  //     });

  //     const queryResult2 = query(
  //       chatRef,
  //       where('chatters', '==', ` ${username}_to_${friend}`)// le cas ou c est moi qui ai commence la conversation 
  //     );
  //     const queryResult3 = query(
  //       chatRef,
  //       where('chatters', '==', ` ${friend}_to_${username}`)
  //     );

  //     const unSubChat1 = onSnapshot(queryResult2, (querySnapshot) => {
  //       querySnapshot.forEach((document) => {
        
  //         const conversation = document.data().conversation;
  //         //console.log("Conversation (chat  1) :", conversation);
  //         let lastMessage = []
  //         if (conversation && conversation.length > 0) {
  //           console.log(conversation.length);
  //           // lastMessage= [conversation.pop()]
  //           lastMessage = [conversation[conversation.length - 1]];
  //           console.log("Dernier message (chat 1) :", lastMessage);
  //         }
  //       else {
  //         console.log(
  //           "Aucun message trouvé dans la conversation avec l'ami (chat 1) :",
  //           friend
  //         );
  //       }
  //       latestMessage = [...latestMessage, {
  //         chatters: document.data().chatters,
  //         message: lastMessage,
  //       }];
  //     });
  //     setLastMessage([...latestMessage]);
  //   })

  //     const unSubChat2 = onSnapshot(queryResult3, (querySnapshot) => {
  //       querySnapshot.forEach((document) => {
  //         console.log("Document trouvé pour ami (chat 2) :", friend);
  //         const conversation = document.data().conversation;
  //         console.log("Conversation (chat 2) :", conversation);
  //         if (conversation && conversation.length > 0) {
  //           console.log(
  //             "Messages trouvés dans la conversation (chat 2) :",
  //             conversation.length
  //           );
  //           const lastMessage = conversation[conversation.length - 1];
  //           console.log("Dernier message (chat 2) :", lastMessage);
  //           latestMessage.push({
  //             chatters: document.data().chatters,
  //             message: lastMessage,
  //           });
  //           setLastMessage([...latestMessage]);
  //         } else {
  //           console.log(
  //             "Aucun message trouvé dans la conversation avec l'ami (chat 2) :",
  //             friend
  //           );
  //         }
  //       });
  //     });

  //     return () => {
  //       unsubFriend();
  //       unSubChat1();
  //       unSubChat2();
  //     };
  //   });

  //   return () => unsubscribe.forEach((unsub) => unsub());
  // }, [friends]);
  
  
  const sortedLastMessage = lastMessage.sort();
  

  const combData = combineData(friendAvatar, sortedLastMessage)
  console.log("combData :", JSON.stringify(combData));

 
  
  
  
  return (
    <>
      {isLoading ? (
        <View className="items-center justify-center h-full">
          <ActivityIndicator
            size="large"
            color="black"
          />
        </View>
      ) : (
          <FlatList
            data={combData}
            renderItem={({ item }) => (
              <ChatItem navigation={navigation} friend={item} />
          )}/>
      )}

      <View className=" flex flex-row-reverse absolute bottom-12 right-6">
        <View>
          <TouchableOpacity
            onPress={() => navigation.navigate("search")}
            className="h-16 rounded-full items-center justify-center bg-yellow-400 w-16">
            <Ionicons
              name="search"
              size={30}
              color="black"
            />
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

export default HomePage;
