import React, { useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import api from "../../services/api";

function AcompanharPedido({ navigation, route }) {
  const [ordemServico, setOrdemServico] = useState(route.params.ordemservico);
  /*const [status, setStatus] = useState(
    getStatusByOrdemServicoId("619d7c3d4864c63c403419cb")
  );*/
  const user = route.params.user;

  async function getStatusByOrdemServicoId(id_ordemservico) {
    try {
      console.log("id_ordi" + id_ordemservico);
      const response = await api.get("/ordemservico/" + id_ordemservico);
      console.log(response.data.ordens[0].status);
      return response.data.ordens[0].status;
    } catch (err) {
      alert(err.message);
    }
  }

  function getItensPedido(itensPedido) {
    let stringPedido = "";
    for (let item of ordemServico.itensPedido) {
      stringPedido +=
        "\n" +
        item.quantidade +
        " x " +
        item.nome +
        " R$" +
        item.preco.toFixed(2) +
        " (cada)\n" +
        getStrAdicionais(item.adicionais);
    }

    return stringPedido;
  }

  function getStrAdicionais(...adicionais) {
    let retorno = "";

    for (let obj in adicionais[0]) {
      if (adicionais[0][obj].quantidade > 0) {
        retorno +=
          "+" +
          adicionais[0][obj].quantidade +
          "x " +
          adicionais[0][obj].nome +
          " R$" +
          adicionais[0][obj].preco.toFixed(2) +
          " (cada)" +
          "\n";
      }
    }

    return retorno;
  }

  return (
    <View style={styles.container}>
      <View style={styles.infosPessoais}>
        <Text style={styles.title}>Informações pessoais:</Text>
        <Text></Text>
        <Text style={styles.base}>Nome: {ordemServico.nome}</Text>
        <Text style={styles.base}>Telefone: {ordemServico.telefone}</Text>
        <Text style={styles.base}>
          Endereco: {ordemServico.delivery_address}
        </Text>
      </View>
      <View style={styles.infosPedido}>
        <Text style={styles.title}>Informações do pedido:</Text>
        <Text style={styles.base}>
          {getItensPedido(ordemServico.itensPedido)}
        </Text>
        <Text style={styles.base}>
          Valor da entrega: R$
          {parseFloat(ordemServico.valor_entrega).toFixed(2)}
        </Text>
        <Text style={styles.base}>
          Valor Final: R${parseFloat(ordemServico.preco).toFixed(2)}
        </Text>
        <Text style={styles.base}>
          Forma de pagamento: {ordemServico.forma_pagamento}
        </Text>
        <Text style={styles.base}>
          Enviar troco para R$: {ordemServico.troco_para}
        </Text>
      </View>
      <View style={styles.infosStatus}>
        <Text style={styles.title}>Status:</Text>
        <Text></Text>
        <Text style={styles.base}>{ordemServico.status}</Text>
      </View>
      <View>
        <TouchableOpacity
          style={styles.loginBtn}
          onPress={() =>
            alert(
              "previsão de entrega: 60 mins" +
                "\nvocê será notificado a cada etapa do processo de produção; por favor, aguarde.."
            )
          }
        >
          <Text>verificar status</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.loginBtn}
          onPress={() =>
            navigation.navigate("Cardapio", {
              user: user,
              zerarPedido: true,
            })
          }
        >
          <Text>fazer outro pedido</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#503292",
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    fontWeight: "bold",
    color: "#ffcd17",
  },

  base: {
    color: "white",
  },
  infosPessoais: {
    paddingBottom: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  infosPedido: {
    paddingBottom: 30,
    justifyContent: "center",
    alignItems: "center",
  },

  infosStatus: {},

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

export default AcompanharPedido;
