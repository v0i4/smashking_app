import React, { useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import api from "../../services/api";

function AcompanharPedido({ navigation, route }) {
  const [ordemServico, setOrdemServico] = useState(route.params.ordemservico);
  const [status, setStatus] = useState(ordemServico.status);
  const user = route.params.user;

  async function getStatus(user_id) {
    try {
      const response = await api.get("/ordemservico/user_id/" + user_id);
      console.log(response);
      return response.data;
    } catch (err) {
      alert(err.message);
    }
  }

  async function getStatusByOrdemServicoId(id_ordemservico) {
    try {
      console.log("id_ordi" + JSON.stringify(id_ordemservico));
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

  async function refreshStatusMsg() {
    let statusMsg = "";
    let sts = "";

    sts = await getStatus(ordemServico.user_id);
    let data = new Date(sts.ordens[0].data);

    setStatus(
      /*data.getHours() + ":" + data.getMinutes() + " " + */ sts.ordens[0]
        .status
    );

    statusMsg =
      status +
      "\nprevisão de entrega: 60 mins" +
      "\nvocê será notificado a cada etapa do processo de produção; por favor, aguarde..";

    return statusMsg;
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
        <Text style={styles.base}>{status}</Text>
      </View>
      <View></View>

      <View style={styles.footer}>
        <View style={styles.footerCol1}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("Cardapio", {
                user: user,
                zerarPedido: true,
              });
            }}
            style={styles.enviarPedidoBtn}
          >
            <Text style={{ color: "#503292", fontSize: 12 }}>
              fazer outro pedido
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footerCol2}>
          <TouchableOpacity
            style={styles.enviarPedidoBtn}
            onPress={() =>
              refreshStatusMsg().then(
                alert(
                  "\ntempo médio de entrega: 60 mins" +
                    "\nvocê será notificado a cada etapa do processo de produção; por favor, aguarde.."
                )
              )
            }
          >
            <Text style={{ color: "#503292", fontSize: 12 }}>
              verificar status
            </Text>
          </TouchableOpacity>
        </View>
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
    borderRadius: 50,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    backgroundColor: "#ffcd17",
  },

  footer: {
    flexShrink: 1,
    position: "absolute",
    bottom: 0,
    height: 40,
    backgroundColor: "#ffcd17",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 100,
    fontSize: 5,
  },

  footerCol1: {
    flexShrink: 1,
    backgroundColor: "#ffcd17",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    fontSize: 5,
  },

  footerCol2: {
    flexShrink: 1,
    backgroundColor: "#ffcd17",
    flexDirection: "column",
    alignItems: "flex-end",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    fontSize: 5,
  },
});

export default AcompanharPedido;
