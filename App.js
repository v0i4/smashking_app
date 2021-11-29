import React from "react";
import { StyleSheet, StatusBar } from "react-native";
import WelcomeScreen from "./app/screens/WelcomeScreen";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginScreen from "./app/screens/LoginScreen";
import RegisterScreen from "./app/screens/RegisterScreen";
import Cardapio from "./app/screens/Cardapio";
import Pedido from "./app/screens/Pedido";
import AcompanharPedido from "./app/screens/AcompanharPedido";
import DetalhesPedido from "./app/screens/DetalhesPedido";

import * as Constants from "expo-constants";
import * as Permissions from "expo-permissions";
import * as Notifications from "expo-notifications";
import api from "./services/api";
import { useState, useEffect } from "react";

export default function App() {
  /*
  const [expoPushToken, setExpoPushToken] = useState(null);

  useEffect(() => {
    registerForPushNotificationsAsync();
  }, []);

  useEffect(() => {
    if (expoPushToken != null) {
      sendToken();
    }
  }, [expoPushToken]);

  //Registra o token do usuário
  const registerForPushNotificationsAsync = async () => {
    if (Constants.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        alert("Failed to get push token for push notification!");
        return;
      }
      const token = (await Notifications.getExpoPushTokenAsync()).data;
      setExpoPushToken(token);
      console.log(token);
      //this.setState({ expoPushToken: token });
    } else {
      alert("Must use physical device for Push Notifications");
    }

    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }
  };

  //Envio do token

  async function sendToken() {
    console.log(expoPushToken + "<---");

    const response = await api.post("/token", { token: expoPushToken });
  }
  */

  return <MyStack />;
}

const Stack = createNativeStackNavigator();

const MyStack = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Welcome"
          component={WelcomeScreen}
          options={{ title: "bem-vindx!" }}
        />
        <Stack.Screen
          name="LoginScreen"
          component={LoginScreen}
          options={{ title: "identifique-se" }}
        />
        <Stack.Screen
          name="RegisterScreen"
          component={RegisterScreen}
          options={{ title: "registre-se" }}
        />
        <Stack.Screen
          name="Cardapio"
          component={Cardapio}
          options={{ title: "escolha seu lanche:", headerBackVisible: false }}
        />
        <Stack.Screen
          name="DetalhesPedido"
          component={DetalhesPedido}
          options={{ title: "detalhes do pedido" }}
        />
        <Stack.Screen
          name="Pedido"
          component={Pedido}
          options={{ title: "confirme seu pedido:" }}
        />

        <Stack.Screen
          name="AcompanharPedido"
          component={AcompanharPedido}
          options={{ title: "acompanhe seu pedido:", headerBackVisible: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffcd17",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
});
