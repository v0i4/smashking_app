import React, { useState } from "react";
import Navigator from "react-native";
import api from "../../services/api";

function handleRegisterUser(
  nome,
  email,
  endereco,
  nroCel,
  senha,
  senhaConfirmacao,
  navigation,
  expoPushToken
) {
  let user = {
    nome: nome,
    email: email,
    endereco_completo: endereco,
    nro_celular: nroCel,
    senha: senha,
    token: expoPushToken,
    dataCadastro: Date.now(),
  };
  /*
  let user = {
    nome: "nome",
    email: "email",
    endereco_completo: "endereco",
    nro_celular: "nroCel",
    senha: "senha",
    token: expoPushToken,
    dataCadastro: Date.now(),
  };
*/
  const credenciais = {
    email: user.email,
    senha: user.senha,
  };

  /*
  // só p testes
  const credenciais = {
    email: "toni@gmail.com ",
    senha: "1",
  };
*/
  //verifica se é login ou registro
  if ((user.endereco_completo && user.nro_celular) == null) {
    //no caso de LOGIN:

    const response = api
      .post("/users/login", credenciais)
      .then(function (response) {
        if (response.data.error) {
          alert("usuario/senha invalidos");
        } else {
          alert("login sucesso");

          console.log(response.data.user.nome + "----------------------");
          //redireciona para HOME
          navigation.navigate("Cardapio", { user: response.data.user });
        }
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
  } else {
    //SENAO, REGISTRA
    api
      .post("/users", user)
      .then(function (response) {
        console.log(response);
        navigation.navigate("Cardapio", { user: response.data.response });
        alert("cadastrado com sucesso, obrigado! ;)");
      })
      .catch(function (error) {
        console.log(error);
      });
  }
}

export default handleRegisterUser;
