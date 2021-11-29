import React from "react";
import {
  ImageBackground,
  StyleSheet,
  View,
  Button,
  TextInput,
  StatusBar,
  Text,
  TouchableOpacity,
  Navigator,
} from "react-native";
import { useState, useEffect } from "react";
import * as Constants from "expo-constants";
import * as Permissions from "expo-permissions";
import * as Notifications from "expo-notifications";

import userController from "../controllers/userController";
import handleRegisterUser from "../controllers/userController";
import api from "../../services/api";
//import DeviceInfo from "react-native-device-info";

function RegisterScreen({ navigation }) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [endereco, setEndereco] = useState("");
  const [nroCel, setNroCel] = useState("");
  const [senha, setSenha] = useState("");
  const [senhaConfirmacao, setSenhaConfirmacao] = useState("");
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
    if (/*Constants.isDevice*/ true) {
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
      console.log(expoPushToken);
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

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.inputView}>
        <TextInput
          style={styles.TextInput}
          placeholder="nome"
          placeholderTextColor="#503292"
          onChangeText={(nome) => setNome(nome)}
        />
      </View>

      <View style={styles.inputView}>
        <TextInput
          style={styles.TextInput}
          placeholder="email"
          placeholderTextColor="#503292"
          onChangeText={(email) => setEmail(email)}
        />
      </View>

      <View style={styles.inputView}>
        <TextInput
          style={styles.TextInput}
          placeholder="endereco completo"
          placeholderTextColor="#503292"
          onChangeText={(endereco) => setEndereco(endereco)}
        />
      </View>

      <View style={styles.inputView}>
        <TextInput
          style={styles.TextInput}
          placeholder="nro de celular"
          placeholderTextColor="#503292"
          onChangeText={(nroCel) => setNroCel(nroCel)}
        />
      </View>

      <View style={styles.inputView}>
        <TextInput
          style={styles.TextInput}
          placeholder="senha"
          placeholderTextColor="#503292"
          secureTextEntry={true}
          onChangeText={(senha) => setSenha(senha)}
        />
      </View>

      <View style={styles.inputView}>
        <TextInput
          style={styles.TextInput}
          placeholder="confirme sua senha"
          placeholderTextColor="#503292"
          secureTextEntry={true}
          onChangeText={(senhaConfirmacao) =>
            setSenhaConfirmacao(senhaConfirmacao)
          }
        />
      </View>

      <TouchableOpacity
        onPress={() => {
          handleRegisterUser(
            nome,
            email,
            endereco,
            nroCel,
            senha,
            null,
            navigation,
            expoPushToken
          );
        }}
        style={styles.loginBtn}
      >
        <Text style={{ color: "white" }}>dale!</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffcd17",
    alignItems: "center",
    justifyContent: "center",
  },

  image: {
    marginBottom: 40,
  },

  inputView: {
    backgroundColor: "#FFF",
    borderRadius: 30,
    width: "70%",
    height: 45,
    marginBottom: 20,

    alignItems: "center",
  },

  TextInput: {
    textAlign: "center",
    color: "#003f5c",
    height: 50,
    flex: 1,
    padding: 10,
    marginLeft: 20,
  },

  forgot_button: {
    height: 30,
    marginBottom: 30,
  },

  loginBtn: {
    width: "80%",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    backgroundColor: "#503292",
  },
});

export default RegisterScreen;
