import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { collection,updateDoc,doc,arrayUnion, getDocs, query, where } from "firebase/firestore";
import React, { useContext, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { AuthenticatedUserContext } from "../../Service/AuthContext";
import { auth, db } from "../../firebase/config";
const SearchPage = () => {
  const navigation = useNavigation();
  const { user, userAvatarUrl, setUserAvatarUrl } = useContext(
    AuthenticatedUserContext
  );
  const [searchUser, setSearchUser] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [found, setFound] = useState(false);
  const [searchedUsername, setSearchedUsername] = useState([]);
  console.log(user);
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
          const { profilePic, username, userId, email } = document.data();
          friends.push({ profilePic, username, userId, email });
        });
        setSearchedUsername(friends);
        setFound(true);
      }
      setIsLoading(false);
    }
  };

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
          className="h-10 rounded-lg items-center justify-center bg-yellow-400 w-10"
        >
          <Ionicons name="search" size={20} color="black" />
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <ActivityIndicator size={"large"} color={"black"} />
      ) : found ? (
        <View>
          <FlatList
            data={searchedUsername}
            keyExtractor={(item) => item.username}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  console.log(auth.currentUser.uid);
                  console.log(item.userId);
                  updateDoc(doc(db, "Users",auth.currentUser.uid), {
                    "realFriend": arrayUnion(item.userId),
                  });
                  navigation.replace("chat", {
                    userName: item.username,
                    userAvatar: item.profilePic,
                    userEmail: item.email,
                    userId: item.userId,
                  });
                }}
              >
                <View className="flex-row items-center space-x-4 bg-gray-200 p-2 rounded-lg mx-4 mt-5">
                  {item.profilePic !== undefined ? (
                    <Image
                      source={{ uri: item.profilePic }}
                      className="h-12 w-12 rounded-full"
                    />
                  ) : (
                    <View>
                      <FontAwesome name="user-circle" size={24} color="white" />
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
