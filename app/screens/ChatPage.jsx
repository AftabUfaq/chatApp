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
  useCallback,
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
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db, auth } from "../../firebase/config";
import { AuthenticatedUserContext } from "../../Service/AuthContext";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { GiftedChat } from "react-native-gifted-chat";
import MessageItem from "../component/MessageItem";

const ChatPage = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { userName, userAvatar, userEmail } = route.params;
  const [message, setMessage] = useState("");
  const [allMessages, setAllMessages] = useState([]);
  const { user } = useContext(AuthenticatedUserContext);
  const sender = user.email.split("@")[0];
  const [isLoading, setIsLoading] = useState(false);
  const flatList = useRef(null);
  const chatRef = collection(db, "chats");
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
    //   const q = query(collection(db, "chats"), orderBy("createdAt", "desc"));
    //   const unsubscribe = onSnapshot(q, (snapshot) =>
    //     setMessages(
    //       snapshot.docs.map((doc) => ({
    //         _id: doc.data()._id,
    //         createdAt: doc.data().createdAt.toDate(),
    //         text: doc.data().text,
    //         user: doc.data().user,
    //       }))
    //     )
    //   );

    //   return () => {
    //     unsubscribe();
    //   };
  });

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
            message1.createdAt?.seconds -
            message2.createdAt.setAllMessages(messages)
        );
      }
    };

    const unsub1 = onSnapshot(queryResult1, (snapshot) => {
      const messages = snapshot.docs.map((doc) => doc.data().conversation);
      setAllMessages(messages);
    });
    const unsub2 = onSnapshot(queryResult2, (snapshot) => {
      const messages = snapshot.docs.map((doc) => doc.data().conversation);
      setAllMessages(messages);
    });

    fetchMessages();
    return () => {
      unsub1();
      unsub2();
    };
  }, []);

  console.log(allMessages);

  const HandleSubmit = async () => {
    const querySnapshot1 = await getDocs(queryResult1);
    const querySnapshot2 = await getDocs(queryResult2);

    // Si le document existe dans querySnapshot1 ou querySnapshot2, mettez à jour le document existant
    if (!querySnapshot1.empty || !querySnapshot2.empty) {
      querySnapshot1.forEach((document) => {
        updateDoc(doc(db, "chats", document.id), {
          conversation: [
            ...document.data().conversation,
            {
              message: message,
              createdAt: Timestamp.now(),
              sender: sender,
            },
          ],
        });
      });

      querySnapshot2.forEach((document) => {
        updateDoc(doc(db, "chats", document.id), {
          conversation: [
            ...document.data().conversation,
            {
              message: message,
              createdAt: Timestamp.now(),
              sender: sender,
            },
          ],
        });
      });

      setMessage("");
    }
    // Sinon, créez un nouveau document
    else {
      await addDoc(collection(db, "chats"), {
        chatters: ` ${sender}_to_${userName}`,
        conversation: [
          {
            message: message,
            createdAt: Timestamp.now(),
            sender: sender,
          },
        ],
      });
    }
  };

  return (
    <View className="flex-1 mb-3">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={180}>
        {allMessages[0] !== undefined && (
          <View className="flex-1">
            <FlatList
              data={allMessages[0]}
              ref={flatList}
              initialNumberToRender={10}
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
        <View className="flex-row">
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
        
      </KeyboardAvoidingView>
    </View>

    //ceci en dessous c est un test de youtube

    //   <View className="w-full bg-white px-4 py-6 rounded-t-[50px] flex-1 -mt-10">
    //     <KeyboardAvoidingView className="flex-1" behavior={ Platform.OS === "ios" ? "padding" : "height"}  keyboardVerticalOffset={180}>
    //       <>
    //         <ScrollView>
    //           {isLoading ? (

    //           )}
    //       </ScrollView>
    //       </>

    //     </KeyboardAvoidingView>

    //   </View>
    // );

    //qi finit ici

    // useEffect(() => {
    //    setMessages([
    //      {
    //        _id: 1,
    //        text: "Hello developer",
    //        createdAt: new Date(),
    //        user: {
    //          _id: 2,
    //          name: "React Native",
    //          avatar: "https://placeimg.com/140/140/any",
    //        },
    //      },
    //    ]);
    //  }, []);
    //    const onSend = useCallback((messages = []) => {
    //      const { _id, createdAt, text, user } = messages[0];

    //      addDoc(collection(db, "chats"), { _id, createdAt, text, user });
    //    }, []);

    //   return (
    //     <SafeAreaView className="flex-1">
    //     <GiftedChat
    //       messages={messages}
    //       showAvatarForEveryMessage={true}
    //       onSend={(messages) => onSend(messages)}
    //       user={{
    //         _id: auth?.currentUser?.email,
    //         name: auth?.currentUser?.displayName,
    //         avatar: auth?.currentUser?.photoURL,
    //       }}
    //               />
    // </SafeAreaView>
  );
};

export default ChatPage;
