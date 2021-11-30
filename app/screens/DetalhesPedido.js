import React, { useEffect, useState } from "react";
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
import api from "../../services/api";

function DetalhesPedido({ navigation, route }) {
  const lanche = route.params.lanche;
  const user = route.params.user;
  //const pedido = route.params.pedido;
  const [pedido, setPedido] = useState(route.params.pedido);
  //todos adicionais disponiveis no cardapio
  const [adicionais, setAdicionais] = useState([]);
  const [quantidadePrincipal, setQuantidadePrincipal] = useState(1);
  //adicionais que o cliente deseja
  const [listaAdicionais, setListaAdicionais] = useState([]);

  //const [pedido, setPedido] = route.params.pedido;
  const [valorAdicional, setValorAdicional] = useState(0);
  const [valorTotal, setValorTotal] = useState(0);
  let nomesAdicionaisPedidos = [];

  useEffect(() => {
    getAdicionais();
  }, []);

  useEffect(() => {
    calculaValor();
  }, [valorTotal]);

  async function getAdicionais() {
    try {
      const response = await api.get("/adicionais");
      setAdicionais(response.data.adicionais);
      console.log(adicionais);
    } catch (err) {
      alert(err.message);
    }
  }

  function somaValorAdicional() {
    let soma = 0;
    for (let item of listaAdicionais) {
      console.log("SOMANDO " + item.preco);
      soma = soma + item.preco;
    }

    setValorAdicional(soma);

    return soma;
  }

  function calculaValor() {
    let valor = parseFloat(lanche.quantidade * lanche.preco).toFixed(2);

    let valorFormatado = 0;
    //soma os adicionais
    for (let item of listaAdicionais) {
      valor = parseFloat(valor) + parseFloat(item.preco) * item.quantidade;
    }

    return parseFloat(valor).toFixed(2);
  }

  function addLanche() {
    setQuantidadePrincipal(quantidadePrincipal + 1);
    lanche.quantidade = quantidadePrincipal + 1;
  }

  function removeLanche() {
    setQuantidadePrincipal(quantidadePrincipal - 1);
    lanche.quantidade = quantidadePrincipal - 1;
  }

  function addAdicional(adicional) {
    setValorTotal(calculaValor());

    let exists = false;
    for (let item of listaAdicionais) {
      if (item._id == adicional._id) {
        item.quantidade = item.quantidade + 1;
        console.log(
          "incrementando ja existente" + item.quantidade + "x " + item.nome
        );
        exists = true;
      }
    }

    if (!exists) {
      adicional.quantidade = 1;
      setListaAdicionais(listaAdicionais.concat(adicional));
      console.log("inserindo novo adicional" + adicional.nome);
    }
  }

  function removeAdicional({ _id }) {
    let cont = 0;
    for (let item of listaAdicionais) {
      if (_id == item._id) {
        if (item.quantidade > 0) {
          item.quantidade = item.quantidade - 1;
          console.log("dropando item " + item.quantidade + item.nome);
        }
      }
    }
    //console.log("CONT + = " + cont);
  }

  function getQuantidade({ _id }) {
    for (let item of listaAdicionais) {
      if (_id == item._id) {
        return item.quantidade;
      }
    }
  }

  function Adicionais({ nome, preco, quantidade, _id }) {
    const adicional = {
      nome: nome,
      preco: preco,
      quantidade: quantidade,
      _id: _id,
    };

    return (
      <View style={styles.adicionais}>
        <Text style={{ color: "white", paddingTop: 20 }}>{nome}</Text>
        <Text style={{ color: "white", paddingTop: 20 }}>
          {" R$"}
          {quantidade > 0 ? (preco * quantidade).toFixed(2) : preco}
        </Text>
        <TouchableOpacity
          style={styles.adicionais}
          onPress={() => {
            removeAdicional({ _id });
          }}
          style={styles.addButton}
        >
          <Text style={{ color: "#503292" }}> - </Text>
        </TouchableOpacity>

        <Text style={{ color: "white", paddingTop: 20, paddingLeft: 20 }}>
          {getQuantidade({ _id }) == null ? 0 : getQuantidade({ _id })}
        </Text>
        <TouchableOpacity
          onPress={() => {
            let novoAdicional = {
              nome: nome,
              preco: preco,
              quantidade: quantidade,
              _id: _id,
            };
            addAdicional(novoAdicional);
          }}
          style={styles.addButton}
        >
          <Text sstyle={{ color: "#503292" }}> + </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.enviarPedidoBtn}>
          <Text style={{ color: "#503292" }}>olá {user.nome}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            //SET ADICIONAIS
            lanche.adicionais = listaAdicionais;
            //console.log(lanche.adicionais + " - adicionais");
            //setPedido(pedido.concat(lanche));
            /*console.log(
              "-------------------INICIO PEDIDO----------------------"
            );
            console.log(pedido);
            console.log(
              "--------------------FIM PEDIDO------------------------"
            );*/
            navigation.navigate("Pedido", {
              pedido: pedido,
              valorParcial: calculaValor(pedido),
              lanche: lanche,
              user: user,
            });
          }}
          style={styles.enviarPedidoBtn}
        >
          <Text style={{ color: "#503292" }}>avançar({pedido.length})</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.container_list}>
        <View style={styles.organizer}>
          <View>
            <Image
              style={styles.fotoBurgerNaLista}
              source={{
                uri: lanche.foto,
              }}
            />
            <Text style={styles.title}>{lanche.nome}</Text>
          </View>

          <View style={{ flexShrink: 1 }}>
            <Text style={styles.descricao}>{lanche.descricao}</Text>
            <Text style={styles.preco}>
              R${(quantidadePrincipal * lanche.preco).toFixed(2)}
            </Text>
            <View style={styles.qtdButtons}>
              <TouchableOpacity
                onPress={() => {
                  if (quantidadePrincipal > 1) removeLanche();
                }}
                style={styles.addButton}
              >
                <Text style={{ color: "#503292" }}> - </Text>
              </TouchableOpacity>
              <View style={{ paddingTop: 20, paddingLeft: 15 }}>
                <Text style={{ color: "white" }}>{quantidadePrincipal}</Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  lanche.quantidade = quantidadePrincipal;
                  addLanche();
                }}
                style={styles.addButton}
              >
                <Text style={{ color: "#503292" }}> + </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View style={{ marginVertical: 160 }}>
          <FlatList
            //style={styles.burgerList}
            data={adicionais}
            renderItem={({ item }) => (
              <Adicionais
                foto={item.foto}
                nome={item.nome}
                descricao={item.descricao}
                preco={item.preco}
                quantidade={item.quantidade}
                _id={item._id}
              />
            )}
            keyExtractor={(item) => item._id}
          />
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.footerCol1}>
          <TouchableOpacity
            onPress={
              () => {
                navigation.navigate("Cardapio", {
                  pedido: pedido,
                  user: user,
                });
              }

              /*() => {
                for (let i of listaAdicionais) {
                  console.log(i);
                }
              }*/
            }
            style={styles.enviarPedidoBtn}
          >
            <Text style={{ color: "#503292", fontSize: 12 }}>
              adicionar outro(s)
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footerCol2}>
          <TouchableOpacity style={styles.enviarPedidoBtn}>
            <Text style={{ color: "#503292", fontSize: 12 }}>
              total: R${calculaValor()}
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
    flexShrink: 1,
    backgroundColor: "#503292",
  },

  adicionais: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingTop: 20,
    paddingHorizontal: 20,
  },

  qtdButtons: {
    flexDirection: "row",
    flex: 1,
    justifyContent: "center",
  },

  header: {
    height: 60,
    backgroundColor: "#ffcd17",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 80,
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
    width: "20%",
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

export default DetalhesPedido;
