import { useNavigation } from "@react-navigation/native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { addDoc, collection } from "firebase/firestore";
import React, { useState } from "react";
import {
  Alert,
  Dimensions,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { auth, db } from "../../firebase/config";
const WIDTH = Dimensions.get("screen").width - 20;
const Register = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const HandleRegister = () => {
    if (email === "" || password === "" || confirmPassword === "")
      Alert.alert("error", "complete all fields");
    else if (password !== confirmPassword)
      Alert.alert("error", " passwords do not match");
    else {
      createUserWithEmailAndPassword(auth, email, password)
        .then(
          async (res) =>
            await addDoc(collection(db, "Users"), {
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
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontWeight: "800", color: "#009", fontSize: 40 }}>
        Create New Account
      </Text>

      <View className="mt-10 items-center">
        <View style={styles.textInoutOuterView}>
          <Text style={{ fontWeight: "800", color: "#009", fontSize: 14 }}>
            Enter Your Email
          </Text>
          <TextInput
            placeholder="Enter Email"
            autoCapitalize="none"
            value={email}
            keyboardType="email-address"
            textContentType="emailAddress"
            autoFocus={true}
            onChangeText={setEmail}
            style={styles.textInput}
          />
        </View>
        <View style={styles.textInoutOuterView}>
          <Text style={{ fontWeight: "800", color: "#009", fontSize: 14 }}>
            Enter Your password
          </Text>
          <TextInput
            placeholder="Enter Password"
            autoCapitalize="none"
            autoFocus={true}
            value={password}
            secureTextEntry={true}
            autoCorrect={false}
            textContentType="password"
            onChangeText={setPassword}
            style={styles.textInput}
          />
        </View>

        <View style={styles.textInoutOuterView}>
          <Text style={{ fontWeight: "800", color: "#009", fontSize: 14 }}>
            Confrim Your password
          </Text>
          <TextInput
            placeholder="Confrim Password"
            autoCapitalize="none"
            autoFocus={true}
            value={confirmPassword}
            secureTextEntry={true}
            autoCorrect={false}
            textContentType="password"
            onChangeText={setConfirmPassword}
            style={styles.textInput}
          />
        </View>
      </View>

      <TouchableOpacity onPress={HandleRegister} style={styles.buttonStyle}>
        <Text style={{ color: "#fff", fontWeight: "800", fontSize: 18 }}>
          Register
        </Text>
      </TouchableOpacity>

      <View
        style={{
          width: WIDTH,
          marginTop: 20,
          flexDirection: "row",
          justifyContent: "flex-end",
        }}
      >
        <Text className="font-light tracking-wider">
          do you have ein konto??
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text className="font-medium text-[#85b6c6]">Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Register;

const styles = StyleSheet.create({
  textInoutOuterView: {
    width: WIDTH,
    marginTop: 15,
  },
  textInput: {
    width: WIDTH,
    alignSelf: "center",
    height: 55,
    paddingHorizontal: 20,
    backgroundColor: "#0090FF11",
    borderRadius: 5,
    fontWeight: "600",
    marginTop: 5,
  },
  buttonStyle: {
    width: WIDTH,
    backgroundColor: "#0090FF",
    height: 55,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginTop: 50,
  },
});
