import React from 'react';
import {ImageBackground, StyleSheet, View, Button, Navigator} from "react-native";

function WelcomeScreen({navigation}) {

    return (
        <ImageBackground 
        style ={styles.background}
          source = {require('../assets/smashking.png')}
          >
              <View style={styles.loginButton}>
                <Button 
                    title="Login" 
                    color="#503292"
                    onPress={()=> navigation.navigate('LoginScreen')}
                    ></Button>
              </View>
        
              <View style={styles.registerButton}>
              <Button title="Cadastre-se" 
                      color="#503292"
                      onPress={()=> navigation.navigate('RegisterScreen')}
                      >
                </Button>
              </View>

          </ImageBackground>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        justifyContent: "flex-end",
        alignItems: 'center',
        
    },
    loginButton: {
        borderRadius: 30,
        width: '80%',
        height: 40,
        color: '#503292',
        
    },
    registerButton: {
        borderRadius: 30,
        width: '80%',
        height: 40,
        color: '#503292',
        
    }
})

export default WelcomeScreen;