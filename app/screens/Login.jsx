import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
  Dimensions,
} from "react-native";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scrollview";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase/config";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Entypo, MaterialIcons } from "@expo/vector-icons";
import { registerIndieID, unregisterIndieDevice } from "native-notify";
import axios from "axios";

const screenWidth = Math.round(Dimensions.get("window").width);

const BackImage = require("../../assets/bg.jpg");
const Login = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const HandleLogin = () => {
    if (email === "" || password === "") {
      Alert.alert("error", "remolissez tout les champs");
    } else {
      signInWithEmailAndPassword(auth, email, password)
        .then(registerIndieID(`${email}`, 20570, "RNJ0Xbecd643jTVwUjXQVo"))
        .catch((err) => {
         
          Alert.alert(" Incorrect  Email or Password ");
        });
    }
  };

  return (
    <View className="flex-1 items-center justify-start ">
      <Image
        source={BackImage}
        className="h-30 "
        style={{ width: screenWidth }}
        resizeMode="cover"
      />

      <View className="bg-white h-full w-full rounded-t-[90px] justify-start py-6 px-6 space-y-6 -mt-44 ">
        <Text className="text-sky-500 text-3xl font-semibold text-center py-3 mt-3">
          Welcome Back!
        </Text>

        <View className="mt-10 items-center  w-full border  rounded-2xl px-4 py-4 flex-row  justify-between space-x-4 my-2">
          <MaterialCommunityIcons
            name="email"
            size={24}
            color="black"
          />

          <TextInput
            className="tracking-widest rounded-lg w-80 text-base py-2 px-1 mx-5 "
            placeholder="Enter Email"
            autoCapitalize="none"
            value={email}
            keyboardType="email-address"
            textContentType="emailAddress"
            autoFocus={true}
            onChangeText={setEmail}
          />
        </View>
        <View className="border rounded-2xl flex-row items-center px-4 py-4 space-x-4 my-2 justify-between">
          <MaterialIcons
            name="password"
            size={24}
            color="black"
          />
          <TextInput
            className="tracking-widest rounded-lg w-80 text-base py-2 px-1 mx-5 "
            placeholder="Enter Password"
            autoCapitalize="none"
            autoFocus={true}
            value={password}
            secureTextEntry={true}
            autoCorrect={false}
            textContentType="password"
            onChangeText={setPassword}
          />
        </View>

        <TouchableOpacity
          onPress={HandleLogin}
          className="  py-5 w-full rounded-xl bg-sky-500 my-3 ">
          <Text className=" text-center font-semibold text-lg text-white">
            Login
          </Text>
        </TouchableOpacity>

        <View className="flex-row space-x-2 justify-center">
          <Text className="font-light tracking-wider">Neu?</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Register")}>
            <Text className="font-medium text-[#85b6c6]">register hier</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Login;
