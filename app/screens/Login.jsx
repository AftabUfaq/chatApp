import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import {
  Alert,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  View,
  Dimensions,
} from "react-native";
import { auth } from "../../firebase/config";
const WIDTH =  Dimensions.get("screen").width - 20;
const Login = () => {
  
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const HandleLogin = () => {
    if (email === "" || password === "") {
      Alert.alert("error", "remolissez tout les champs");
    } else {
      signInWithEmailAndPassword(auth, email, password)
        .then(() => {
         
        })
        .catch((err) => {
        
          alert(" Incorrect  Email or Password ");
        });
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontWeight: "800", color: "#009", fontSize: 40 }}>
        Welcome Back!
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
      </View>

      <TouchableOpacity onPress={HandleLogin} style={styles.buttonStyle}>
        <Text style={{ color: "#fff", fontWeight: "800", fontSize: 18 }}>
          LogIn
        </Text>
      </TouchableOpacity>

      <View style={{width:WIDTH, marginTop:20,  flexDirection:"row", justifyContent:"flex-end"}}>
        <Text className="font-light tracking-wider">Neu?</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Register")}>
          <Text className="font-medium text-[#85b6c6]">Register hier</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  textInoutOuterView: {
    width:WIDTH,
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
