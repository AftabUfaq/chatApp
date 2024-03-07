import { View, Text, TouchableOpacity, StatusBar, Image, ActivityIndicator, FlatList } from "react-native";
import React, { useEffect, useLayoutEffect , useContext, useState} from "react";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase/config";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";
import { UserRef } from "../../firebase/config";
import { Ionicons } from "@expo/vector-icons";
import {
  QuerySnapshot,
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";

import { AuthenticatedUserContext } from "../../Service/AuthContext";


const HomePage = () => {
    const navigation = useNavigation();
      const {  user,userAvatarUrl, setUserAvatarUrl } = useContext(
        AuthenticatedUserContext
      );
const [isLoading, setIsLoading]= useState(false);
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
            <TouchableOpacity onPress={() => navigation.navigate("profil")}>
                {!userAvatarUrl ? (<FontAwesome
            name="user-circle"
            size={24}
            color="white"
                />) : (<Image source={{ uri: userAvatarUrl }} className =" h-12 w-12 rounded-full"/>                  
                )
        }
          
        </TouchableOpacity>
      ),
    });
  });
    
     const queryResult = query(UserRef, where("email", "==", user.email));

    
    
useEffect(() => {
    if (!user) return
    async function DocFinder(queryResult) {
        const querySnapshot = await getDocs(queryResult);
        querySnapshot.forEach((doc) => {
    
            const { image } = doc.data();
            setUserAvatarUrl(image)
   
   
        })
    }
});
  return (
    <>
      {isLoading ? (
        <View className="items-center justify-center h-full">
          <ActivityIndicator
            size="large"
            color={black}
          />
        </View>
      ) : (
        <FlatList />
      )}

      <View className=" flex flex-row-reverse absolute bottom-12 right-6">
        <View>
          <TouchableOpacity onPress={ ()=> navigation.navigate("search")} className="h-16 rounded-full items-center justify-center bg-yellow-400 w-16">
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
