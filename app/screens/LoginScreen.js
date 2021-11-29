import React from 'react';
import {ImageBackground, StyleSheet, View, Button, TextInput, StatusBar, TouchableOpacity, Text, Navigator} from "react-native";
import { useState } from 'react';
import userController from '../controllers/userController'



function LoginScreen({navigation}){

    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');

    function handleClick() {
      
      //valida login
      userController(null, email, null, null,  senha, null, navigation)

      
    }

    return (
        <View style={styles.container}>
               
          <StatusBar style="auto" />
          <View style={styles.inputView}>
            <TextInput
              name = "email"
              style={styles.TextInput}
              placeholder="email"
              placeholderTextColor="#503292"
              onChangeText={(email) => setEmail(email)}
            />
          </View>
     
          <View style={styles.inputView}>
            <TextInput
              name = "senha"
              style={styles.TextInput}
              placeholder="senha"
              placeholderTextColor="#503292"
              secureTextEntry={true}
              onChangeText={(senha) => setSenha(senha)}
            />
          </View>
     
          <TouchableOpacity>
            <Text style={styles.forgot_button}>esqueceu a senha?</Text>
          </TouchableOpacity>
     
          <TouchableOpacity onPress={handleClick}style={styles.loginBtn}>
            <Text style={{color:'white'}}>dale!</Text>
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
      textAlign: 'center',
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

export default LoginScreen;