import {
  addDoc,
  collection,doc,
  deleteDoc,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { View, Image, SafeAreaView } from "react-native";
import { Bubble, GiftedChat, InputToolbar } from "react-native-gifted-chat";
import { auth, db } from "../../firebase/config";

const Chat = ({ navigation, route }) => {
  const c_uid = auth?.currentUser.uid;
  const t_uid = route.params.userId;
  const [messages, setMessages] = useState([]);

  const customtInputToolbar = (props) => {
    return (
      <InputToolbar
        {...props}
        containerStyle={{
          backgroundColor: "white",
          borderTopColor: "#E8E8E8",
          borderTopWidth: 1,
        }}
      />
    );
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ marginLeft: 20 }}>
          <Image
            style={{ width: 30, height: 30, borderRadius: 30 }}
            source={{
              uri: route.params.avatar,
            }}
          />
        </View>
      ),
    });
  }, [navigation]);

  useEffect(() => {
    getAllMessages();
  }, []);

  const getAllMessages = async () => {
    const chatid = t_uid > c_uid ? c_uid + "-" + t_uid : t_uid + "-" + c_uid;
    const q = query(
      collection(db, "Chats", chatid, "messages"),
      orderBy("createdAt", "desc")
    );
    const unsubscribe = onSnapshot(q, (snapshot) =>
      setMessages(
        snapshot.docs.map((doc) => {
          return {
            messageId: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt.toDate(),
          };
        })
      )
    );
  };

  const onSendMsg = async (msgArray) => {
    const msg = msgArray[0];
    const time = new Date();
    const userMsg = {
      ...msg,
      sentBy: c_uid,
      sentTo: t_uid,
      createdAt: time,
    };
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, userMsg)
    );
    const chatid = t_uid > c_uid ? c_uid + "-" + t_uid : t_uid + "-" + c_uid;

    //collection of React
    const docRef = collection(db, "Chats", chatid, "messages");
    await addDoc(docRef, { ...userMsg, createdAt: time });
  };

  const deleteMessage = (msg) => {
    const chatid = t_uid > c_uid ? c_uid + "-" + t_uid : t_uid + "-" + c_uid;
    const msgId = msg.messageId;
    const docRef = doc(collection(db, "Chats", chatid, "messages"), msgId);
    deleteDoc(docRef)
      .then(() => {
        console.log("Document successfully deleted!");
        getAllMessages()
      })
      .catch((error) => {
        console.error("Error removing document: ", error);
      });
  };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#ffff" }}>
      <GiftedChat
        style={{ flex: 1, backgroundColor: "#001973" }}
        showAvatarForEveryMessage={true}
        messages={messages}
        onSend={(text) => onSendMsg(text)}
        user={{
          _id: c_uid,
          avatar:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSYFh3DlJzVRCMfRMDJ3xUwJgjgmkB_bOnstpAy5_FRZA&s",
        }}
        renderInputToolbar={(props) => customtInputToolbar(props)}
        renderBubble={(props) => {
          // deleteMessage(props.currentMessage);
          return (
            <Bubble
              {...props}
              onLongPress={() => deleteMessage(props.currentMessage)}
              onQuickReply={() => alert("QuickReplt")}
              textStyle={{
                right: {
                  color: "white",
                  // fontFamily: "CerebriSans-Book"
                },
                left: {
                  color: "#24204F",
                  // fontFamily: "CerebriSans-Book"
                },
              }}
              wrapperStyle={{
                left: {
                  backgroundColor: "#E6F5F3",
                },
                right: {
                  backgroundColor: "#3A13C3",
                },
              }}
            />
          );
        }}
      />
    </SafeAreaView>
  );
};

export default Chat;
