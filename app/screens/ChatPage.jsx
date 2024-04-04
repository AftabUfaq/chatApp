import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  SafeAreaView,
  FlatList,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from "react-native";
import React, {
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

import { FontAwesome } from "@expo/vector-icons";
import {
  Timestamp,
  addDoc,
  collection,
  doc,
  getDocs,
  onSnapshot,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../../firebase/config";
import { AuthenticatedUserContext } from "../../Service/AuthContext";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import MessageItem from "../component/MessageItem";
import axios from "axios";
const ChatPage = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { userName, userAvatar, userEmail } = route.params;
  const [message, setMessage] = useState("");
  const [allMessages, setAllMessages] = useState([]);
  const { user } = useContext(AuthenticatedUserContext);
  const sender = user.email.split("@")[0];
  const [isLoading, setIsLoading] = useState(false);
  const flatListRef = useRef(null);
  
  const [isListReady, setIsListReady] = useState(false);
  const chatRef = collection(db,"chats");
const queryResult1 = query(
  chatRef,
  where("chatters", "==", `${sender}_to_${userName}`)
);

const queryResult2 = query(
  chatRef,
  where("chatters", "==", `${userName}_to_${sender}`)
);
 

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <View className="flex-row items-center space-x-5">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons
              name="return-up-back-outline"
              size={40}
              color="black"
            />
          </TouchableOpacity>
          {userAvatar === undefined ? (
            <FontAwesome
              name="user-circle"
              size={40}
              color="black"
            />
          ) : (
            <Image
              source={{ uri: userAvatar }}
              className="w-12 h-12 rounded-full"
            />
          )}
          <Text className="text-2xl">{userName}</Text>
        </View>
      ),
    });
   
  }
  ,[]);

  useEffect(() => {
    const fetchMessages = async () => {
      const querySnapshot1 = await getDocs(queryResult1);
      const querySnapshot2 = await getDocs(queryResult2);

      if (!querySnapshot1.empty || !querySnapshot2.empty) {
        let messages = querySnapshot1.docs.map(
          (doc) => doc.data().conversation
        );
        messages = messages.concat(
          querySnapshot2.docs.map((doc) => doc.data().conversation)
        );
        messages = messages.sort(
          (message1, message2) =>
            message1.createdAt?.seconds - message2.createdAt?.seconds
        );
        setAllMessages(messages);
      }
    };
    // onsnapshot verifie si un message a ete envoye et  lorsq un msge a ete envoye il recuper et met ds messages
    // unsub c sont des listener
    const unsub1 = onSnapshot(queryResult1, (snapshot) => {
      const messages = snapshot.docs.map((doc) => doc.data().conversation);
      setAllMessages(messages);
    });
    const unsub2 = onSnapshot(queryResult2, (snapshot) => {
      const messages = snapshot.docs.map((doc) => doc.data().conversation);
      setAllMessages(messages);
    });

    fetchMessages()
    return () => {
      unsub1();
      unsub2();
    };
  }, []); // elle se lance juste une fois lorsqon est sur cette page

 //console.log("tous les messages=", JSON.stringify(allMessages, null, 2));

  // const HandleSubmit = async () => {
  //   const querySnapshot1 = await getDocs(queryResult1);
  //   const querySnapshot2 = await getDocs(queryResult2);
  //   // Vérifiez si un document existe dans querySnapshot1 ou querySnapshot2
  //   if (!querySnapshot1.empty && !querySnapshot2.empty) {

  //     querySnapshot1.forEach((document) => {
  //       updateDoc(doc(db, "chats", document.id), {
  //         conversation: [
  //           ...document.data().conversation, {
  //             message: message,
  //             createdAt: Timestamp.now(),
  //             sender: sender,
  //           }
  //         ]
  //       }).catch((error) => console.log(error));
  //     });

  //     querySnapshot2.forEach((document) => {
  //       updateDoc(doc(db, "chats", document.id), {
  //         conversation: [
  //           ...document.data().conversation,
  //           {
  //             message: message,
  //             createdAt: Timestamp.now(),
  //             sender: sender,
  //           },
  //         ],
  //       }).catch((error) => console.log(error));
  //     });

  //   } else {
  //  await addDoc(collection(db, "chats"), {
  //       chatters: ` ${sender}_to_${userName}`,
  //       conversation: [
  //         {
  //           message: message,
  //           createdAt: Timestamp.now(),
  //           sender: sender,
  //         },
  //       ],
  //     });
  //   }

  //   //   // Si un document est trouvé, mettez à jour le document existant
  //   //   updateDoc(doc(db, "chats", documentIdToUpdate), {
  //   //     conversation: [
  //   //       ...allMessages,
  //   //       {
  //   //         message: message,
  //   //         createdAt: Timestamp.now(),
  //   //         sender: sender,
  //   //       },
  //   //     ],
  //   //   });
  //   // } else {
  //   //   // Si aucun document n'est trouvé, créez un nouveau document
  //   //
  //   // }

  //    setMessage("");
  // };

  // const HandleSubmit = async () => {
  //    const queryResult1 = query(
  //      chatRef,
  //      where("chatters", "==", "${sender}_to_${userName}")
  //    );

  //    console.log(queryResult1);
  //    const queryResult2 = query(
  //      chatRef,
  //      where("chatters", "==", "${userName}_to_${sender}")
  //    );
  //    console.log("**Valeurs de sender et userName :**");
  //    console.log("sender:", sender);
  //    console.log("userName:", userName);
  //   const querySnapshot1 = await getDocs(queryResult1);
  //   const querySnapshot2 = await getDocs(queryResult2);

  //   console.log("Query Snapshot 1:", querySnapshot1.empty);
  //   console.log("Query Snapshot 2:", querySnapshot2.empty);

  //   // Vérifiez si un document existe dans querySnapshot1 ou querySnapshot2
  //   if (!querySnapshot1.empty || !querySnapshot2.empty) {

  //     console.log("Updating existing documents...");

  //     querySnapshot1.forEach((document) => {
  //       updateDoc(doc(db, "chats", document.id), {
  //         conversation: [
  //           ...document.data().conversation,
  //           {
  //             message: message,
  //             createdAt: Timestamp.now(),
  //             sender: sender,
  //           },
  //         ],
  //       }).catch((error) => console.log(error));
  //     });

  //     querySnapshot2.forEach((document) => {
  //       updateDoc(doc(db, "chats", document.id), {
  //         conversation: [
  //           ...document.data().conversation,
  //           {
  //             message: message,
  //             createdAt: Timestamp.now(),
  //             sender: sender,
  //           },
  //         ],
  //       }).catch((error) => console.log(error));
  //     });
  //   } else {

  //     console.log("Adding new document...");

  //     await addDoc(collection(db, "chats"), {
  //       chatters: ` ${sender}_to_${userName}`,
  //       conversation: [
  //         {
  //           message: message,
  //           createdAt: Timestamp.now(),
  //           sender: sender,
  //         },
  //       ],
  //     });
  //   }

  //   setMessage("");

  // };



  const HandleSubmit = async () => {
  
  const querySnapshot1 = await getDocs(queryResult1);
  const querySnapshot2 = await getDocs(queryResult2);

  if (!querySnapshot1.empty) {
    querySnapshot1.forEach(async (document) => {
      const docRef = doc(db, "chats", document.id);
      const chatData = document.data();
      const updatedConversation = [
        ...chatData.conversation,
        {
          message: message,
          createdAt: Timestamp.now(),
          sender: sender,
        },
      ];
      await updateDoc(docRef, { conversation: updatedConversation });
    });
  }

  if (!querySnapshot2.empty) {
    querySnapshot2.forEach(async (document) => {
      const docRef = doc(db, "chats", document.id);
      const chatData = document.data();
      const updatedConversation = [
        ...chatData.conversation,
        {
          message: message,
          createdAt: Timestamp.now(),
          sender: sender,
        },
      ];
      await updateDoc(docRef, { conversation: updatedConversation });
    });
  }

  if (querySnapshot1.empty && querySnapshot2.empty) {
    await addDoc(collection(db, "chats"), {
      chatters: `${sender}_to_${userName}`,
      conversation: [
        {
          message: message,
          createdAt: Timestamp.now(),
          sender: sender,
        },
      ],
    });
    }
    
     async function retryRequest(maxRetries = 3) {
       let retries = 0;
       while (retries < maxRetries) {
         try {
           const resp = axios.post(
             `https://app.nativenotify.com/api/indie/notification`,
             {
               subID: `${userEmail}`,
               appId: 20570,
               appToken: "RNJ0Xbecd643jTVwUjXQVo",
               title: `${sender} - ChatChat`,
               message: `${message}`,
             }
           );
          console.log('Sucess');
           return resp
         } catch (error) {
           retries++;
           console.log("request failed, retrying...", error.message);
         }
       }
     }
    retryRequest();
    setMessage("");
    

};

  //  const sendAMessage = async () => {
  //    const timeStamp = serverTimestamp();

  //    const _doc = {
  //      timeStamp: timeStamp,
  //      message: message,
  //      sender: sender,
  //    };

  //    setMessage("");
  //    await addDoc(
  //      collection(doc(db, "chats"), ),
  //      _doc
  //    )
  //      .then(() => {})
  //      .catch((err) => alert(err));
  //  };

  //  useLayoutEffect(() => {
  //    const msgQuery = query(
  //      collection(db, "chats",),
  //      orderBy("timeStamp", "asc")
  //    );

  //    const unsubscribe = onSnapshot(msgQuery, (querySnapShot) => {
  //      const updatedMessages = querySnapShot.docs.map((doc) => doc.data());
  //      setMessage(updatedMessages);
  //      setIsLoading(false);
  //    });

  //    return unsubscribe;
  //  }, []);

  return (
    <View className="flex-1 mb-3">
      {allMessages[0] !== undefined && (
          <View className="flex-1">
            <FlatList
              data={allMessages[0]}
              ref={flatListRef}
            initialNumberToRender={10}
            onContentSizeChange={()=> flatListRef?.current.scrollToEnd({animated:true})}
              keyExtractor={(item) => item.createdAt}
              renderItem={({ item }) => (
                <MessageItem
                  item={item}
                  sender={sender}
                />
              )}
            />
          </View>
        )}
      <View className="flex-row  ">
        <TextInput
          placeholder="write hier"
          multiline={true}
          keyboardType="default"
          value={message}
          onChangeText={setMessage}
          className=" bg-white rounded-lg w-[80%] text-base py-2 px-1 mx-4 mb-5 "
        />
        <TouchableOpacity
          className="mt-2"
          onPress={HandleSubmit}>
          <FontAwesome
            name="send"
            size={22}
            color="black"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ChatPage;
