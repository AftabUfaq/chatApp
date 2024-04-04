import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Image } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

const userAvatar = require("../../assets/profil.png");


const ChatItem = ({ navigation, friend }) => {

console.log("W:",friend.name)

  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("chat", {
          friendName: friend.name,
          friendAvatar: friend.avatar,
          friendEmail: friend.email,
        })
      }
      className=" mt-1 mx-2 ">
      <View className="flex-row bg-slate-300 m-2 items-center py-2 mx-2 rounded-lg">
        {friend.avatar !== undefined ? (
          <Image
            source={{ uri: friend.avatar }}
            className="h-12 w-12 rounded-full mx-3"
          />
        ) : (
          // <Image
          //   source={{ userAvatar }}
          //   className="h-12 w-12 rounded-full mx-3"
          // />
          <FontAwesome
            name="user-circle"
            size={40}
            color="black"
            className="h-12 w-12 rounded-full mx-3"
          />
        )}
        <View>
          <Text className="font-medium tracking-widest text-lg">
            {friend.name}
          </Text>
          <Text className="font-medium tracking-widest text-sm">
            {friend.lastMessage[0]?.message}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ChatItem;
