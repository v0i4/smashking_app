import { useFocusEffect } from "@react-navigation/native";
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
import Dialog from "react-native-dialog";
import api from "../../services/api";
import SelectDropdown from "react-native-select-dropdown";
import Pedido from "./Pedido";
import RadioButtonRN from "radio-buttons-react-native";

function Cardapio({ navigation, route }) {
  const [lanches, setLanches] = useState([]);
  const [pedido, setPedido] = useState([]);
  const [expediente, setExpediente] = useState([]);
  const [adicionaisDialog, setadicionaisDialog] = useState(false);
  const [quantidade, setQuantidade] = useState(1);
  const user = route.params.user;
  const zerarPedido = route.params.zerarPedido;
  const [categoriaSelecionada, setCategoriaSelecionada] = useState("todos");
  const [categoriasDialog, setCategoriasDialog] = useState(false);
  const [categoriasLabel, setCategoriasLabel] = useState("categorias");
  const [valorParcial, setValorParcial] = useState(
    route.params.valorParcial != null ? valorParcial : parseInt(0)
  );
  const categorias = [
    { label: "avulsos" },
    { label: "combos" },
    { label: "bebidas" },
    { label: "doces" },
    { label: "todos" },
  ];

  useEffect(() => {
    getLanches();
    obterExpediente();
    setValorParcial(route.params.valorParcial);

    if (zerarPedido) {
      for (let p in pedido) {
        console.log("poping" + p);
        pedido.pop(p);
      }
      setPedido(pedido);
    }
  }, []);

  useEffect(() => {
    getLanches();
    obterExpediente();
  }, [categoriaSelecionada]);

  useFocusEffect(
    React.useCallback(() => {
      setPedido(pedido);
      console.log(pedido.length);
      return () => atualizarPedidos();
    }, [pedido])
  );

  function atualizarPedidos() {
    return pedido.length;
  }

  function getFirstName(nome) {
    let firstName = nome.split(" ");

    return firstName[0];
  }

  async function obterExpediente() {
    try {
      const response = await api.get("/expediente");
      setExpediente(response.data.expediente);
    } catch (err) {
      alert(err.message);
    }
  }

  function verficaExpediente() {
    let d = new Date();
    let hora = d.getHours();

    //dia atual
    var dia_atual = d.getDay();
    var horario_inicio = "";
    var horario_fim = "";

    for (var dias of [expediente]) {
      //      console.log(dias[parseInt(dia_atual)]);

      if (dias[parseInt(dia_atual)].dia === parseInt(dia_atual)) {
        horario_inicio = dias[parseInt(dia_atual)].horario_inicio;
        horario_fim = dias[parseInt(dia_atual)].horario_fim;
      }
    }
    /*
    console.log(
      " dia_atual " +
        dia_atual +
        " horario inicio " +
        horario_inicio +
        " | horario fim " +
        horario_fim
    );*/

    if (hora >= horario_inicio || hora < horario_fim) {
      return true;
    } else {
      alert(
        "horario de funcionamento: \n(seg - dom) " +
          horario_inicio +
          "h - " +
          horario_fim +
          "h"
      );
      return false;
    }
  }

  function addLanche(lanche) {
    setPedido(pedido.concat(lanche));
  }

  async function getLanches() {
    try {
      if (categoriaSelecionada == "todos") {
        const response = await api.get("/lanches");
        setLanches(response.data.lanches);
        //console.log(lanches);
      } else {
        const response = await api.get(
          "/lanches/categoria/" + categoriaSelecionada
        );
        setLanches(response.data.lanches);
        //console.log(lanches);
      }
    } catch (err) {
      alert(err.message);
    }
  }

  function Lanches({ foto, nome, descricao, preco, _id, categoria }) {
    const lanche = {
      foto: foto,
      nome: nome,
      descricao: descricao,
      preco: preco,
      _id: _id,
      quantidade: quantidade,
      adicionais: [],
      categoria: categoria,
    };

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

            <Text style={styles.title}>{nome} </Text>
          </View>
          <Dialog.Container visible={adicionaisDialog}>
            <Dialog.Title>detalhes:</Dialog.Title>
            <Dialog.Description>
              quantidade:<Text> {quantidade} unidade(s)</Text>
            </Dialog.Description>

            <Dialog.Button
              label="dale!"
              onPress={() => {
                setadicionaisDialog(false);
              }}
            />
          </Dialog.Container>
          <View style={{ flexShrink: 1 }}>
            <Text style={styles.descricao}>{descricao}</Text>
            <Text style={styles.preco}>R${preco} </Text>
            <TouchableOpacity
              onPress={() => {
                if (verficaExpediente()) {
                  pedido.push(lanche);

                  navigation.navigate("DetalhesPedido", {
                    pedido: pedido,
                    user: user,
                    lanche: lanche,
                    valorParcial: valorParcial,
                  });
                }
              }}
              style={styles.addButton}
            >
              <Text style={{ color: "#503292" }}> adicionar! </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.enviarPedidoBtn}>
          <Text style={{ color: "#503292" }}>
            olá {getFirstName(user.nome)}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setCategoriasDialog(true);
          }}
          style={styles.enviarPedidoBtn}
        >
          <Text style={{ color: "#503292" }}>
            categoria - {categoriaSelecionada}
          </Text>
        </TouchableOpacity>

        <Dialog.Container visible={categoriasDialog}>
          <Dialog.Title>escolha a categoria:</Dialog.Title>

          <RadioButtonRN
            data={categorias}
            selectedBtn={(e) => {
              setCategoriaSelecionada(e.label);
              setCategoriasDialog(false);
            }}
          />
        </Dialog.Container>
      </View>

      <FlatList
        style={styles.burgerList}
        data={lanches}
        renderItem={({ item }) => (
          <Lanches
            foto={item.foto}
            nome={item.nome}
            descricao={item.descricao}
            preco={item.preco}
            _id={item._id}
            quantidade={quantidade}
          />
        )}
        //keyExtractor={(item) => item._id}
        keyExtractor={(item) => Math.random() + ""}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffcd17",
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

export default Cardapio;
