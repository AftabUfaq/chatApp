import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  FlatList,
  Alert,
  Image,
} from "react-native";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase/config";
import { FontAwesome } from "@expo/vector-icons";

const SearchPage = () => {
  const navigation = useNavigation();

  const [searchUser, setSearchUser] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [found, setFound] = useState(false);
  const [searchedUsername, setSearchedUsername] = useState([]);

  const HandleSearch = async () => {
    if (searchUser === "") {
      setSearchedUsername([]);
      Alert.alert("Enter a username to search");
    } else {
      setIsLoading(true);
      const UserRef = collection(db, "Users");
      const queryResult = query(
        UserRef,
        where("username", ">=", searchUser.trim()),
        where("username", "<=", searchUser.trim() + "\uf8ff")
      );

      const querySnapshot = await getDocs(queryResult);
      if (!querySnapshot.empty) {
        let friends = [];
        querySnapshot.forEach((document) => {
          const { profilePic, username, email } = document.data();
          friends.push({ profilePic, username, email });
        });
        setSearchedUsername(friends);
        setFound(true);
      }
      setIsLoading(false);
    }
  };
  //console.log("liste d amis", setSearchedUsername);
  console.log("liste d amis", searchedUsername);

  return (
    <View className="flex-1 bg-orange-50">
      <View className="flex-row items-center mt-3 ">
        <TextInput
          className=" h-10 bg-white rounded-lg text-base py-2 mx-2 w-[85%] px-1"
          onSubmitEditing={HandleSearch}
          placeholder="Search a User"
          autoCapitalize="none"
          keyboardType="default"
          value={searchUser}
          onChangeText={setSearchUser}
          textContentType="name"
        />
        <TouchableOpacity
          onPress={HandleSearch}
          className="h-10 rounded-lg items-center justify-center bg-yellow-400 w-10">
          <Ionicons
            name="search"
            size={20}
            color="black"
          />
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <ActivityIndicator
          size={"large"}
          color={"black"}
        />
      ) : found ? (
        <View>
          <FlatList
            data={searchedUsername}
            keyExtractor={(item) => item.username}
            renderItem={({ item }) => (
                <TouchableOpacity onPress={() => navigation.replace('chat', { 
                    userName: item.username,
                    userAvatar: item.profilePic,
                    userEmail: item.email
              })}>
                <View className="flex-row items-center space-x-4 bg-gray-200 p-2 rounded-lg mx-4 mt-5">
                  {item.profilePic !== undefined ? (
                    <Image
                      source={{ uri: item.profilePic }}
                      className="h-12 w-12 rounded-full"
                    />
                  ) : (
                    <View>
                      <FontAwesome
                        name="user-circle"
                        size={24}
                        color="white"
                      />
                    </View>
                  )}

                  <Text className="text-lg tracking-widest">
                    {item.username}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      ) : (
        <View className="justify-center items-center h-full  ">
          <Text className=" text-3xl "> No User Found !!! </Text>
        </View>
      )}
    </View>
  );
};

export default SearchPage;
