import { StatusBar } from "expo-status-bar";
import { Image, Text, View } from "react-native";
import Login from "./app/screens/Login";
import Register from "./app/screens/Register";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomePage from "./app/screens/HomePage";
import AuthenticatedUserProvider, {
  AuthenticatedUserContext,
} from "./Service/AuthContext";
import { useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase/config";
import ProfilePage from "./app/screens/ProfilePage";
import SearchPage from "./app/screens/SearchPage";
import ChatPage from "./app/screens/ChatPage";

const stack = createNativeStackNavigator();
function AuthStack() {
  return (
    <stack.Navigator
      initialRouteName="Login"
      screenOptions={{ headerShown: false }}>
      <stack.Screen
        name="Login"
        component={Login}
      />
      <stack.Screen
        name="Register"
        component={Register}
      />
    </stack.Navigator>
  );
}

function MainStack() {
  return (
    <stack.Navigator>
      <stack.Screen
        options={{
          headerTitle: "ChatChat",
          headerTintColor: "gold",
          headerStyle: {
            backgroundColor: "black",
          },
        }}
        name="Home"
        component={HomePage}
      />
      <stack.Screen
        name="profil"
        component={ProfilePage}
      />

      <stack.Screen
        name="search"
        component={SearchPage}
      />

      <stack.Screen
        name="chat"
        component={ChatPage}
        options={{title: ""}}
      />
    </stack.Navigator>
  );
}

function RootNavigator() {
  const { user, setUser } = useContext(AuthenticatedUserContext);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    //** onAuthStateChanged return an unsubscriber */

    // const unsubscribe = onAuthStateChanged(auth, (user) => {
    //   if (user) {
    //     setUser(user);
    //     setIsLoading(false);
    //   } else {
    //     setIsLoading(false);
    //   }
    // });
    const unsubscribe = onAuthStateChanged(auth,
      async user => {
        user ? setUser(user) : setUser(null);
        setIsLoading(false);
      });

    // Nettoyer l'effet lors du démontage du composant
    return unsubscribe;
  }, [user]);

  console.log("utilisateur =", user);

  return (
    <NavigationContainer>
      {isLoading ? (
        <Text className="bg-fuchsia-500 font-extrabold"> Loading..</Text>
      ) : user ? (
        <MainStack /> // Utilisateur connecté
      ) : (
        <AuthStack /> // Pas d'utilisateur connecté
      )}
    </NavigationContainer>
  );
}

export default function App() {
  return (
    // <View className="flex-1 items-center justify-center justify-center">
    //   {/* <Login /> */}
    //   <Register/>
    //   <StatusBar style="auto" />
    // </View>

    <AuthenticatedUserProvider>
      <RootNavigator>
      
      </RootNavigator>
    </AuthenticatedUserProvider>
    // tt commence ici
  );
}
