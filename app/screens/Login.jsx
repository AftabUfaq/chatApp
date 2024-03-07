import { View, Text, Image, TextInput, TouchableOpacity, Alert } from "react-native";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scrollview";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase/config";
import { FontAwesome } from "@expo/vector-icons";

const backImage = require("../../assets/loginPage.png");
const Login = () => {
    const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const HandleLogin = () => {
    if (email === "" || password === "") {
      Alert.alert('error', 'remolissez tout les champs');
    } else {
      signInWithEmailAndPassword(auth, email, password).then(() =>
       { console.log("succefful eingeloggt")}
      ).catch(err => {
        console.error('login error', err);
        alert(' Incorrect  Email or Password ');
      })
  }

  }

  return (
    <View className="bg-black  ">
      {/* <View>
        <Image
          source={backImage}
          className="object-cover w-40"
        />
      </View> */}

      <View className="bg-white   h-3/4  justify-center items-center">
        <Text className="text-[#FFD700] text-3xl font-semibold text-center py-3 mt-33">
          Welcome Back!
        </Text>

        <View className="mt-10 items-center">
          <FontAwesome
            name="user"
            size={24}
            color="black"
          />
          <TextInput
            className="tracking-widest bg-green-100 rounded-lg w-80 text-base py-2 px-1 mx-5 mb-5"
            placeholder="Enter Email"
            autoCapitalize="none"
            value={email}
            keyboardType="email-address"
            textContentType="emailAddress"
            autoFocus={true}
            onChangeText={setEmail}
          />
          <TextInput
            className="tracking-widest bg-green-100 rounded-lg w-80 text-base py-2 px-1 mx-5 mb-5"
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
          className="bg-slate-500 rounded-md mx-10 mb-2 py-2">
          <Text className=" text-center font-semibold text-white text-lg">
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
