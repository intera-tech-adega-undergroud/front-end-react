import { useState, useEffect } from "react";
import Buscar from "../componentes/Buscar";
import "./Vendas.css";

function VendasPage() {
  const [produtosBanco, setProdutosBanco] = useState([])
  const [resultadosBusca, setResultadosBusca] = useState([]);
  const [carrinho, setCarrinho] = useState([]);
  const [formaPagamento, setFormaPagamento] = useState("PIX");
  const [mensagem, setMensagem] = useState("");
  const [clientes, setClientes] = useState([])
  const [clienteSelecionado, setClienteSelecionado] = useState('')

  // --- CONEXÃO COM O BACKEND: CARREGAR PRODUTOS ---
  useEffect(() => {

    async function carregarProdutos() {

      try {

        const token =
          localStorage.getItem(
            "tokenAdega"
          )

        const resposta = await fetch(
          "http://localhost:8080/produtos",
          {
            headers: {
              Authorization:
                `Bearer ${token}`
            }
          }
        )

        if (resposta.ok) {

          const dados =
            await resposta.json()

          setProdutosBanco(dados)
        }

      } catch (erro) {

        console.error(erro)
      }
    }

    carregarProdutos()

  }, [])

  // --- BUSCAR CLIENTES ---
  useEffect(() => {

    async function buscarClientes() {

      try {

        const token =
          localStorage.getItem(
            "tokenAdega"
          )

        const response =
          await fetch(
            "http://localhost:8080/clientes",
            {
              headers: {
                Authorization:
                  `Bearer ${token}`
              }
            }
          )

        if (response.ok) {

          const dados =
            await response.json()

          setClientes(dados)
        }

      } catch (erro) {

        console.error(erro)
      }
    }

    buscarClientes()

  }, [])

  // --- BUSCAR PRODUTOS ---
  function buscar(texto) {
    if (!texto) {
      setResultadosBusca([]);
      return;
    }
    const filtrados = produtosBanco.filter((p) =>
      p.nome.toLowerCase().includes(texto.toLowerCase())
    );
    setResultadosBusca(filtrados);
  }

  // --- ADICIONAR AO CARRINHO ---
  function adicionarAoCarrinho(produto) {
    const itemExistente = carrinho.find(item => item.idProduto === produto.idProduto);

    if (itemExistente) {
      if (itemExistente.quantidade >= produto.estoque) {
        setMensagem(`Estoque insuficiente para ${produto.nome}!`);
        setTimeout(() => setMensagem(""), 3000);
        return;
      }
      const novoCarrinho = carrinho.map(item =>
        item.idProduto === produto.idProduto ? { ...item, quantidade: item.quantidade + 1 } : item
      );
      setCarrinho(novoCarrinho);
    } else {
      if (produto.estoque <= 0) {
        setMensagem(`${produto.nome} está sem estoque!`);
        setTimeout(() => setMensagem(""), 3000);
        return;
      }
      setCarrinho([...carrinho, { ...produto, quantidade: 1 }]);
    }
    setMensagem("");
  }

  // --- ALTERAR QUANTIDADE NO CARRINHO ---
  function alterarQuantidade(id, delta) {
    const novoCarrinho = carrinho.map(item => {
      if (item.idProduto === id) {
        const novaQtd = item.quantidade + delta;
        if (novaQtd > item.estoque) {
          setMensagem(`Limite de estoque atingido para ${item.nome}!`);
          setTimeout(() => setMensagem(""), 3000);
          return item;
        }
        return { ...item, quantidade: novaQtd };
      }
      return item;
    }).filter(item => item.quantidade > 0); // Se chegar a 0, remove do carrinho

    setCarrinho(novoCarrinho);
  }

  // --- REMOVER ITEM ---
  function removerDoCarrinho(id) {
    setCarrinho(carrinho.filter(item => item.idProduto !== id));
  }

  // --- CALCULAR TOTAL ---
  const totalCarrinho = carrinho.reduce((acc, item) => acc + (item.preco * item.quantidade), 0);

  // --- FINALIZAR VENDA (ASYNC PARA BACKEND) ---
  async function finalizarVenda() {

    if (carrinho.length === 0) {

      setMensagem("O carrinho está vazio!")

      setTimeout(
        () => setMensagem(""),
        3000
      )

      return
    }

    try {

      const token =
        localStorage.getItem("tokenAdega")

      const idFuncionario =
        Number(
          localStorage.getItem(
            "idFuncionario"
          )
        )

      const venda = {

        idFuncionario:

          idFuncionario,

        idCliente:

          formaPagamento === "Fiado"
            ? Number(clienteSelecionado)
            : null,

        formaPagamento:

          formaPagamento,

        pago:

          formaPagamento !== "Fiado",

        itens:

          carrinho.map(item => ({

            idProduto:

              item.idProduto,

            quantidade:

              item.quantidade

          }))
      }

      const response = await fetch(
        "http://localhost:8080/eventos/venda",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`
          },

          body:
            JSON.stringify(venda)
        }
      )

      console.log(venda)

      if (!response.ok) {

        const erro = await response.text();

        console.error("Erro backend:", erro);

        throw new Error(erro);
      }

      setCarrinho([])

      setResultadosBusca([])

      setMensagem(
        "Venda registrada com sucesso!"
      )

      setTimeout(
        () => setMensagem(""),
        4000
      )

    } catch (erro) {

      console.error(erro)

      setMensagem(
        "Erro ao finalizar venda."
      )
    }

    setTimeout(() => setMensagem(""), 5000);
  }

  return (
    <div className="vendas-container">
      <h1>Vendas</h1>

      <div className="pdv-grid">
        {/* LADO ESQUERDO: BUSCA E RESULTADOS */}
        <div className="busca-section">
          <h2>Buscar Produtos</h2>
          <div className="top-bar">
            <Buscar placeholder="Digite o nome do produto..." onSearch={buscar} />
          </div>

          {resultadosBusca.length > 0 && (
            <table className="tabela-busca">
              <thead>
                <tr>
                  <th>Produto</th>
                  <th>Estoque</th>
                  <th>Preço</th>
                  <th>Ação</th>
                </tr>
              </thead>
              <tbody>
                {resultadosBusca.map(produto => (
                  <tr key={produto.idProduto}>
                    <td>{produto.nome}</td>
                    <td>{produto.estoque}</td>
                    <td>R$ {produto.preco.toFixed(2)}</td>
                    <td>
                      <button
                        className="btn-adicionar-carrinho"
                        onClick={() => adicionarAoCarrinho(produto)}
                      >
                        + Add
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* LADO DIREITO: CARRINHO E CHECKOUT */}
        <div className="carrinho-section">
          <h2>Carrinho</h2>

          <div className="carrinho-items">
            {carrinho.length === 0 ? (
              <p className="carrinho-vazio">Seu carrinho está vazio.</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Produto</th>
                    <th>Qtd</th>
                    <th>Subtotal</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {carrinho.map(item => (
                    <tr key={item.idProduto}>
                      <td>{item.nome}</td>
                      <td className="qtd-controls">
                        <button onClick={() => alterarQuantidade(item.idProduto, -1)}>−</button>
                        <span>{item.quantidade}</span>
                        <button onClick={() => alterarQuantidade(item.idProduto, 1)}>+</button>
                      </td>
                      <td>R$ {(item.preco * item.quantidade).toFixed(2)}</td>
                      <td>
                        <button className="btn-remover" onClick={() => removerDoCarrinho(item.idProduto)}>🗑</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div className="checkout-section">
            <div className="total-display">
              <span>Total:</span>
              <span>R$ {totalCarrinho.toFixed(2)}</span>
            </div>

            <div className="pagamento-form">
              <label>Forma de Pagamento:</label>
              <select
                value={formaPagamento}
                onChange={(e) => setFormaPagamento(e.target.value)}
                className="select-pagamento"
              >
                <option value="PIX">PIX</option>
                <option value="Cartão de Crédito">Cartão de Crédito</option>
                <option value="Cartão de Débito">Cartão de Débito</option>
                <option value="Dinheiro">Dinheiro</option>
                <option value="Fiado">Fiado (Registrar pendência)</option>
              </select>
              {
                formaPagamento === "Fiado" && (

                  <div
                    className="pagamento-form"
                  >

                    <label>Cliente</label>

                    <select
                      value={clienteSelecionado}
                      onChange={(e) =>
                        setClienteSelecionado(
                          e.target.value
                        )
                      }
                    >

                      <option value="">
                        Selecione
                      </option>

                      {
                        clientes.map(cliente => (

                          <option
                            key={cliente.idCliente}
                            value={cliente.idCliente}
                          >

                            {cliente.nome}

                          </option>
                        ))
                      }

                    </select>

                  </div>
                )
              }
            </div>

            <button className="btn-finalizar" onClick={finalizarVenda}>
              Finalizar Venda
            </button>
            {mensagem && <div className="mensagem-pdv">{mensagem}</div>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default VendasPage;