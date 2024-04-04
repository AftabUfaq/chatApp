import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Image,
  Platform,
  Dimensions,
  Keyboard,
} from "react-native";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../firebase/config";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scrollview";
import { addDoc, collection } from "firebase/firestore";
import { Entypo, MaterialIcons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const BackImage = require("../../assets/bg.jpg");

const Register = () => {
  const screenWidth = Math.round(Dimensions.get("window").width);
// const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
 
  const navigation = useNavigation();
 

  const HandleRegister = () => {
    if (email === "" || password === "" || confirmPassword === "" || name=== "")
      Alert.alert('error', 'complete all fields')
    else if (password !== confirmPassword)
      Alert.alert('error', ' passwords do not match');
    else {
      createUserWithEmailAndPassword(auth, email, password,name)
        .then(
          async (res) => await addDoc(collection(db, "Users"), {
            userId: res.user.uid,
            email: res.user.email,
           // username: res.user.email.split("@")[0],
            username: res.user.name
          })
        )
        .catch((error) => {
         
          console.error("Erreur lors de l'inscription :", error.message);
         
        });
    }

    
  };


  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 items-center justify-start ">
      <Image
        source={BackImage}
        className="h-30 "
        style={{ width: screenWidth }}
        resizeMode="cover"
      />

      <View className="bg-white h-full w-full rounded-t-[90px] justify-start py-6 px-6 space-y-6 -mt-44 ">
        <Text className="text-sky-500 text-3xl font-semibold text-center py-3 mt-3">
          create New Account
        </Text>

         {/* <View className="mt-10 items-center  w-full border  rounded-2xl px-4 py-4 flex-row  justify-between space-x-4 my-2">
          <FontAwesome
            name="user"
            size={24}
            color="black"
          />
           <TextInput
            className="tracking-widest rounded-lg w-80 text-base py-2 px-1 mx-5  "
            placeholder=" Username"
            autoCapitalize="none"
            value={name}
            keyboardType="email-address"
            textContentType="emailAddress"
            onChangeText={setName}
          />
         </View>   */}

        <View className="mt-10 items-center  w-full border  rounded-2xl px-4 py-4 flex-row  justify-between space-x-4 my-2">
          <MaterialCommunityIcons
            name="email"
            size={24}
            color="black"
          />
          <TextInput
            className="tracking-widest rounded-lg w-80 text-base py-2 px-1 mx-5  "
            placeholder="Email"
            autoCapitalize="none"
            value={email}
            keyboardType="email-address"
            textContentType="emailAddress"
            onChangeText={setEmail}
          />
        </View>
        <View className="border rounded-2xl flex-row items-center px-4 py-4 space-x-4 my-2 justify-between ">
          <MaterialIcons
            name="password"
            size={24}
            color="black"
          />
          <TextInput
            className="tracking-widest rounded-lg w-80 text-base py-2 px-1 mx-5 "
            placeholder="Password"
            autoCapitalize="none"
            value={password}
            secureTextEntry={true}
            autoCorrect={false}
            textContentType="password"
            onChangeText={setPassword}
          />
        </View>
        <View className="border rounded-2xl flex-row items-center px-4 py-4 space-x-4 my-2">
          <MaterialIcons
            name="password"
            size={24}
            color="black"
          />
          <TextInput
            className="tracking-widest  rounded-lg w-80 text-base py-2 px-1 mx-5 "
            placeholder="Confirm Password"
            autoCapitalize="none"
            value={confirmPassword}
            secureTextEntry={true}
            autoCorrect={false}
            textContentType="password"
            onChangeText={setConfirmPassword}
          />
        </View>

        <TouchableOpacity
          onPress={HandleRegister}
          className="  py-5 w-full rounded-xl bg-sky-500 my-3 ">
          <Text className=" text-center font-semibold text-white text-lg">
            Sign Up
          </Text>
        </TouchableOpacity>

        <View className="flex-row space-x-2 justify-center">
          <Text className="font-light tracking-wider">Have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text className="font-medium text-[#85b6c6]">Login Here</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default Register;
