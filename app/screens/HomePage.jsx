import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { getDocs, query, where } from "firebase/firestore";
import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  TouchableOpacity,
  View,
} from "react-native";
import { UserRef } from "../../firebase/config";

import { AuthenticatedUserContext } from "../../Service/AuthContext";

const HomePage = () => {
  const navigation = useNavigation();
  const { user, userAvatarUrl, setUserAvatarUrl } = useContext(
    AuthenticatedUserContext
  );
  const [isLoading, setIsLoading] = useState(false);
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={() => navigation.navigate("profil")}>
          {!userAvatarUrl ? (
            <FontAwesome name="user-circle" size={24} color="white" />
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
  });
  return (
    <>
      {isLoading ? (
        <View className="items-center justify-center h-full">
          <ActivityIndicator size="large" color={black} />
        </View>
      ) : (
        <FlatList />
      )}

      <View className=" flex flex-row-reverse absolute bottom-12 right-6">
        <View>
          <TouchableOpacity
            onPress={() => navigation.navigate("search")}
            className="h-16 rounded-full items-center justify-center bg-yellow-400 w-16"
          >
            <Ionicons name="search" size={30} color="black" />
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

export default HomePage;
