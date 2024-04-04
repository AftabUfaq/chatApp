import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Image,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { Entypo } from "@expo/vector-icons";
import { AuthenticatedUserContext } from "../../Service/AuthContext";
import {
  QuerySnapshot,
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { auth, db } from "../../firebase/config";
import { signOut } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { AsyncStorage } from "react-native";
import { UserRef } from "../../firebase/config";

const ProfilePage = () => {
  const navigation = useNavigation();
  const storage = getStorage;
  const [username, setUsername] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [isLoading, setIsLoading] = useState("");
  const [userImageUrl, setUserImageUrl] = useState(null);
  const { setUser, user, setUserAvatarUrl } = useContext(
    AuthenticatedUserContext
  );

  const queryResult = query(UserRef, where("email", "==", user.email));

  async function DocFinder(queryResult) {
    const querySnapshot = await getDocs(queryResult);
    querySnapshot.forEach((doc) => {
      if (userEmail === "") {
        const { email, username, profilePic } = doc.data();
        setUsername(username);
        setUserEmail(email);
        setUserAvatarUrl(profilePic);
        setUserImageUrl(profilePic);
      }
    });
  }

  useEffect(() => {
    if (!user) return;
    DocFinder(queryResult);
  }, []);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      uploadImage(result.assets[0].uri);
    }
  };

  const uploadImage = async (image) => {
    try {
      setIsLoading(true);

      const blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
          resolve(xhr.response);
        };
        xhr.onerror = function (e) {
          console.log(e);
          reject(new TypeError("Network request failed"));
        };
        xhr.responseType = "blob";
        xhr.open("GET", image, true);
        xhr.send(null);
      });

      const filename = image.substring(image.lastIndexOf("/"));

      const imageRef = ref(getStorage(), `ProfilPics/${filename}`);
      console.log(imageRef);

      uploadBytes(imageRef, blob)
        .then(async () => {
          const downloadUrl = await getDownloadURL(imageRef);
          console.log("Download URL:", downloadUrl);

          // Mettre à jour l'image de l'utilisateur dans la base de données, si nécessaire
          const querySnapshot = await getDocs(queryResult);
          querySnapshot.forEach(async (document) => {
            await updateDoc(doc(db, "Users", document.id), {
              profilePic: downloadUrl,
            }).then(() => {
              setUserImageUrl(downloadUrl);
              setUserAvatarUrl(downloadUrl);
              setIsLoading(false);
              Alert.alert("Image Uploaded!!!");
            });
          });
        })
        .catch((error) => {
          console.log("Error uploading image:", error);
          Alert.alert("Error uploading image:", error.message);
          setIsLoading(false);
        });
    } catch (error) {
      console.log("Error fetching image blob:", error);
      Alert.alert("Error fetching image blob:", error.message);
      setIsLoading(false);
    }
  };

  const deconnection = () => {
    signOut(auth)
      .then(() => {
        setUser(null);
        navigation.navigate("Login");
      })
      .catch((error) => {
        Alert.alert("Error", error.message);
      });
  };

  return (
    <View>
      <View className="justify-center items-center my-10">
        <Text className="text-2xl font-medium track">
          Bienvenue, <Text> {username}</Text>
        </Text>
      </View>
      {/* Sélection d'image depuis la bibliothèque */}
      <TouchableOpacity
        onPress={pickImage}
        className="rounded-md bg-gray-300 items-center justify-center mx-10 mb-10">
        {userImageUrl === null || undefined ? (
          <Entypo
            name="camera"
            size={50}
            color="black"
          />
        ) : isLoading ? (
          <ActivityIndicator
            size="large"
            color="black"
          />
        ) : (
          <Image
            source={{ uri: userImageUrl }}
            className=" w-full h-40 rounded-md"
          />
        )}
      </TouchableOpacity>

      <View className="items-center">
        <Text
          className="tracking-widest bg-gray-200 rounded-lg w-[80%] text-base py-2 px-1
                  mb-5 text-slate-900 font-light">
          {username}
        </Text>
        <Text
          className="tracking-widest bg-gray-200 rounded-lg w-[80%] text-base py-2 px-1
                  mb-5 text-slate-900 font-light">
          {userEmail}
        </Text>
      </View>

      <TouchableOpacity
        onPress={deconnection}
        className="bg-[#fac23a] py-2 rounded-md mx-10 mt-10 mb-3">
        <Text className="text-center font-semibold text-lg">Auslogen</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ProfilePage;
