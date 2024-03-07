import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../firebase/config";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scrollview";
import { addDoc, collection } from "firebase/firestore";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigation = useNavigation();

  const HandleRegister = () => {
    if (email === "" || password === "" || confirmPassword === "")
      Alert.alert('error', 'complete all fields')
    else if (password !== confirmPassword)
      Alert.alert('error', ' passwords do not match');
    else {
      createUserWithEmailAndPassword(auth, email, password)
        .then(
          async (res) => await addDoc(collection(db, "Users"), {
            userId: res.user.uid,
            email: res.user.email,
            username: res.user.email.split("@")[0],
          })
        )
        .catch((error) => {
          // Une erreur s'est produite lors de l'inscription
          console.error("Erreur lors de l'inscription :", error.message);
         
        });
    }
  };

  return (
    <KeyboardAwareScrollView className="bg-slate-400 py-1 px-1">
      {/* <View>
        <Image
          source={backImage}
          className="object-cover w-40"
        />
      </View> */}

      <View className="bg-white rounded-t-3xl">
        <Text className="text-[#d60e43] text-3xl font-semibold text-center py-3 mt-3">
         create New Account
        </Text>

        <View className="mt-10 items-center">
          <TextInput
            className="tracking-widest bg-green-100 rounded-lg w-80 text-base py-2 px-1 mx-5 mb-5"
            placeholder="Email"
            autoCapitalize="none"
            value={email}
            keyboardType="email-address"
            textContentType="emailAddress"
            onChangeText={setEmail}
          />
          <TextInput
            className="tracking-widest bg-green-100 rounded-lg w-80 text-base py-2 px-1 mx-5 mb-5"
            placeholder="Password"
            autoCapitalize="none"
            value={password}
            secureTextEntry={true}
            autoCorrect={false}
            textContentType="password"
            onChangeText={setPassword}
          />
          <TextInput
            className="tracking-widest bg-green-100 rounded-lg w-80 text-base py-2 px-1 mx-5 mb-5"
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
          className="bg-slate-500 rounded-md mx-10 mb-2 py-2">
          <Text className=" text-center font-semibold text-white text-lg">
            Registrieren
          </Text>
        </TouchableOpacity>

        <View className="flex-row space-x-2 justify-center">
          <Text className="font-light tracking-wider">
            do you have ein konto?
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text className="font-medium text-[#85b6c6]">Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
};

export default Register;
