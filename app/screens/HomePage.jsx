import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { AuthenticatedUserContext } from "../../Service/AuthContext";
import { db } from "../../firebase/config";
const HomePage = () => {
  const navigation = useNavigation();
  const { user, userAvatarUrl, setUserAvatarUrl } = useContext(
    AuthenticatedUserContext
  );
  const [isLoading, setIsLoading] = useState(true);
  const [notiUsers] = useState([]);
  const [Users, setUsers] = useState([]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={() => navigation.navigate("profile")}>
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

  useEffect(() => {
    getUserContacts();
  }, [navigation]);

  const getUserContacts = () => {
    const q = query(doc(db, "Users", user.uid));

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const contactsObject = snapshot.data().realFriend;

      //  contactsObject.push(user.uid);
      console.log(contactsObject, "contactsObject");
      const q1 = query(
        collection(db, "Users"),
        where("userId", "in", contactsObject)
      );
      const contactsSnap = await getDocs(q1);
      const contactDetails = contactsSnap.docs.map((d) => ({
        ...d.data(),
        key: d.data().uid,
      }));
      console.log(contactDetails, "contactDetails");
      setUsers(contactDetails);
      setIsLoading(false);
    });
  };

  return (
    <>
      {isLoading ? (
        <View className="items-center justify-center h-full">
          <ActivityIndicator size="large" color={"#000"} />
        </View>
      ) : (
        <FlatList
          data={Users}
          keyExtractor={({ item, index }) => `${index}`}
          renderItem={({ item, index }) => {
            return (
              <TouchableOpacity
              onPress={() => {
                navigation.navigate("chat", {
                  userName: item.username,
                  userAvatar: item.profilePic,
                  userEmail: item.email,
                  userId: item.userId,
                });
              }}
                style={{
                  flexDirection: "row",
                  width: Dimensions.get("screen").width - 30,
                  alignSelf: "center",
                  height: 50,
                  alignItems: "center",
                  paddingHorizontal:20,
                  marginTop:20,
                  backgroundColor: "#0001",
                }}
              >
                {item.profilePic !== undefined ? (
                  <Image
                    source={{ uri: item.profilePic }}
                    className="h-12 w-12 rounded-full"
                  />
                ) : (
                  <View>
                    <FontAwesome name="user-circle" size={24} color="#000" />
                  </View>
                )}
                <Text style={{ fontWeight: "600", marginLeft:20 }}>{item.username}</Text>
              </TouchableOpacity>
            );
          }}
        />
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
