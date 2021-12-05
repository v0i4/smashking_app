import React, { Component, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Text,
  Image,
  Button,
  TouchableOpacity,
  Navigator,
} from "react-native";
import RadioButtonRN from "radio-buttons-react-native";
import Dialog from "react-native-dialog";
import api from "../../services/api";

function Pedido({ navigation, route }) {
  //aqui a lista de lanches vai receber apenas os lanches selecionados na tela anterior
  const [lanches, setLanches] = useState(route.params.pedido);
  const [adicionais, setAdicionais] = useState(route.params.adicionais);
  const [pedido, setPedido] = useState([route.params.pedido]);
  const valorParcial = route.params.valorParcial;
  const user = route.params.user;
  const [deliveryLabel, setdeliveryLabel] = useState("delivery");
  const [pagamentoDialog, setPagamentoDialog] = useState(false);
  const [pagamentoLabel, setPagamentoLabel] = useState("forma de pagamento");
  const [trocoDialog, setTrocoDialog] = useState(false);
  const [deliveryDialog, setDeliveryDialog] = useState(false);
  const [troco, setTroco] = useState(0);

  useEffect(() => {
    setPedido(route.params.pedido);
  }, []);

  useEffect(() => {
    setLanches(pedido);
    calcularPreco(pedido);
    console.log("preco total:" + ordemServico.preco);
  }, [{ pedido }]);

  async function registrarPedido(ordemServico) {
    //console.log(ordemServico);

    try {
      const response = await api
        .post("/ordemservico", ordemServico)
        .then(console.log("pedido registrado"));
      return response;
    } catch (error) {
      console.log(error.message);
    }
  }

  function handleTroco(preco, troco_para) {
    setTrocoDialog(false);
  }

  function getValorEntrega() {
    if (deliveryLabel === "retirada no balcao") {
      return 0;
    }

    return ordemServico.valor_entrega;
  }

  function calcularPreco(valorParcial, valor_entrega) {
    if (deliveryLabel === "retirada no balcao") {
      valor_entrega = 0;
    }
    return valorParcial + valor_entrega;
  }

  function calcularPrecoFinal(valor_entrega) {
    let soma = 0;
    console.log("AQUI");
    console.log(pedido);

    try {
      for (let p of pedido) {
        soma += parseFloat(p.preco) * parseFloat(p.quantidade);

        //  if (p.adicionais.length > 0) {
        for (let a of p.adicionais) {
          soma += parseFloat(a.preco) * parseFloat(a.quantidade);
          //console.log(p.adicionais);
        }
        // }
      }
    } catch (error) {
      for (let p of pedido[0]) {
        soma += parseFloat(p.preco) * parseFloat(p.quantidade);

        //if (p.adicionais.length > 0) {
        for (let a of p.adicionais) {
          soma += parseFloat(a.preco) * parseFloat(a.quantidade);
          //console.log(p.adicionais);
        }
        // }
      }
    }

    return soma + valor_entrega;
  }

  let ordemServico = {
    user_id: user._id,
    nome: user.nome,
    telefone: user.nro_celular,
    itensPedido: pedido,
    status: "Enviando Pedido à cozinha",
    delivery_address:
      deliveryLabel != "retirada no balcao"
        ? user.endereco_completo
        : "RETIRADA NO BALCAO",
    valor_entrega: 5,
    preco: calcularPrecoFinal(5),
    troco_para: troco,
    forma_pagamento: pagamentoLabel,
    token: user.token,
    data: Date.now(),
  };

  function Lanches({ foto, nome, descricao, preco, quantidade, _id }) {
    const lanche = {
      foto: foto,
      nome: nome,
      descricao: descricao,
      preco: preco,
      quantidade: quantidade,
      _id: _id,
    };

    function removeLanche(lanche) {
      for (let i = 0; i < pedido.length; i++) {
        if (pedido[i].nome === lanche.nome) {
          console.log("removendo :" + pedido[i].nome);
          setLanches(pedido.splice(i, 1));
          setPedido(lanches);
        }
      }
    }

    return (
      <View style={styles.container_list}>
        <View style={styles.organizer}>
          <View>
            <Image
              style={styles.fotoBurgerNaLista}
              source={{
                uri: foto,
              }}
            />

            <Text style={styles.title}>{nome}</Text>
          </View>

          <View style={{ flexShrink: 1 }}>
            <Text style={styles.descricao}>{descricao}</Text>
            <Text style={styles.preco}>
              {quantidade}x R${preco}{" "}
            </Text>
            <TouchableOpacity
              onPress={() => {
                removeLanche(lanche);
              }}
              style={styles.addButton}
            >
              <Text style={{ color: "#503292" }}> remover </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  const formaPagamento = [
    {
      label: "cartão de credito/debito",
    },
    {
      label: "dinheiro",
    },
  ];

  const formaEntrega = [
    {
      label: "delivery",
    },
    {
      label: "retirada no balcao",
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            setPagamentoDialog(true);
          }}
          style={styles.enviarPedidoBtn}
        >
          <Text style={{ color: "#503292" }}>{pagamentoLabel}</Text>
        </TouchableOpacity>
        <View>
          <Dialog.Container visible={pagamentoDialog}>
            <Dialog.Title>escolha a forma de pagamento:</Dialog.Title>

            <RadioButtonRN
              data={formaPagamento}
              selectedBtn={(e) => {
                setPagamentoDialog(false);

                if (e.label === "dinheiro") {
                  setTrocoDialog(true);
                }
                setPagamentoLabel(e.label);
                deliveryDialog;
                console.log(e);
              }}
            />
          </Dialog.Container>

          <Dialog.Container visible={trocoDialog}>
            <Dialog.Title>precisa de troco?:</Dialog.Title>
            <Dialog.Description>
              o valor da sua compra é de R$
              {parseFloat(ordemServico.preco).toFixed(2)}, enviar troco para:
            </Dialog.Description>
            <Dialog.Input
              keyboardType="numeric"
              onChangeText={(value) => {
                setTroco(value);
                console.log("troco: " + troco);
              }}
            />
            <Dialog.Button
              label="dale!"
              onPress={() => {
                setTrocoDialog(false);
              }}
            />
          </Dialog.Container>
        </View>

        <TouchableOpacity
          onPress={() => {
            if (pagamentoLabel === "forma de pagamento") {
              alert("escolha uma forma de pagamento");
            } else {
              registrarPedido(ordemServico);
              navigation.navigate("AcompanharPedido", {
                ordemservico: ordemServico,
                user: user,
              });
            }
          }}
          style={styles.enviarPedidoBtn}
        >
          <Text style={{ color: "#503292" }}>enviar!</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        style={styles.burgerList}
        data={pedido}
        renderItem={({ item }) => (
          <Lanches
            foto={item.foto}
            nome={item.nome}
            descricao={item.descricao}
            quantidade={item.quantidade}
            preco={item.preco}
            _id={item._id}
          />
        )}
        keyExtractor={(item) => Math.random() + ""}
        //keyExtractor={(item) => item._id}
      />

      <View style={styles.footer}>
        <View style={styles.footerCol1}>
          <Text style={{ color: "#503292", fontSize: 12 }}>
            forma de entrega:
          </Text>

          <TouchableOpacity
            onPress={() => {
              setDeliveryDialog(true);
            }}
            style={styles.enviarPedidoBtn}
          >
            <Text style={{ color: "#503292" }}>{deliveryLabel}</Text>
          </TouchableOpacity>

          <Dialog.Container visible={deliveryDialog}>
            <Dialog.Title>escolha a forma de entrega:</Dialog.Title>

            <RadioButtonRN
              data={formaEntrega}
              selectedBtn={(e) => {
                setdeliveryLabel(e.label);
                setDeliveryDialog(false);

                if (e.label === "retirada no balcao") {
                  setdeliveryLabel(e.label);
                }

                console.log(e);
              }}
            />
          </Dialog.Container>
        </View>

        <View style={styles.footerCol2}>
          <TouchableOpacity style={styles.enviarPedidoBtn}>
            <Text style={{ color: "#503292", fontSize: 12 }}>
              entrega: R${getValorEntrega()}
            </Text>
          </TouchableOpacity>
          <Text style={{ color: "#503292", fontSize: 12 }}>
            total: R${parseFloat(ordemServico.preco).toFixed(2)}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffcd17",
  },
  selectInput: {
    transform: [{ scaleX: 0.7 }, { scaleY: 0.7 }],
  },

  flatList: { paddingBottom: 10 },

  footer: {
    flexShrink: 1,
    height: 90,
    backgroundColor: "#ffcd17",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    fontSize: 5,
  },

  footerCol1: {
    flexShrink: 1,
    height: 70,
    backgroundColor: "#ffcd17",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 10,
    paddingTop: 10,
    fontSize: 5,
  },

  footerCol2: {
    flexShrink: 1,
    height: 70,
    backgroundColor: "#ffcd17",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 10,
    paddingTop: 10,
    fontSize: 5,
  },

  header: {
    height: 60,
    backgroundColor: "#ffcd17",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 80,
  },

  container_list: {
    paddingTop: 50,
    paddingLeft: 50,
    paddingRight: 50,
    //flexDirection:'column',
    alignItems: "center",
    justifyContent: "center",
  },

  fotoBurgerNaLista: {
    width: 120,
    height: 120,
    backgroundColor: "#fff",
    borderRadius: 50,
    borderColor: "#ffcd17",
    borderWidth: 5,
    alignSelf: "flex-start",
  },

  box: {
    elevation: 10,
  },

  title: {
    paddingTop: 10,
    color: "#ffcd17",
    textAlign: "center",
    fontWeight: "bold",
    alignItems: "center",
    justifyContent: "center",
  },

  descricao: {
    paddingTop: 10,
    paddingLeft: 10,
    justifyContent: "center",
    color: "white",
    textAlign: "center",
    fontSize: 11,
    alignSelf: "auto",
    flexWrap: "wrap",
  },

  burgerList: {
    backgroundColor: "#503292",
    paddingBottom: 20,
  },

  preco: {
    color: "#ffcd17",
    //paddingLeft: 10,
    paddingTop: 10,
    textAlign: "center",
  },

  addButton: {
    borderRadius: 30,
    width: "80%",
    height: 40,
    backgroundColor: "#ffcd17",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 20,
    marginTop: 10,
  },

  enviarPedidoBtn: {
    alignContent: "flex-end",
  },

  organizer: {
    flexDirection: "row",
    flex: 1,
  },
  item: {
    width: "50%",
  },
});

export default Pedido;
