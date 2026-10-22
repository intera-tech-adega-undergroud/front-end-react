import { useState, useEffect } from "react";
import { Plus, ShoppingCart, Trash2, User } from "lucide-react";
import Buscar from "../componentes/Buscar";
import iconMoney from "../assets/iconMoney.svg";
import "./Vendas.css";

function VendasPage() {
  const [produtosBanco, setProdutosBanco] = useState([])
  const [resultadosBusca, setResultadosBusca] = useState([]);
  const [carrinho, setCarrinho] = useState([]);
  const [formaPagamento, setFormaPagamento] = useState("PIX");
  const [divisaoAtiva, setDivisaoAtiva] = useState(false);
  const [pagamentosDivididos, setPagamentosDivididos] = useState([]);
  const [proximoPagamentoId, setProximoPagamentoId] = useState(1);
  const [desconto, setDesconto] = useState("");
  const [valorRecebido, setValorRecebido] = useState("");
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
  const descontoAplicado = Math.min(
    Math.max(Number(desconto) || 0, 0),
    totalCarrinho
  );
  const totalComDesconto = Math.max(totalCarrinho - descontoAplicado, 0);
  const troco = Math.max((Number(valorRecebido) || 0) - totalComDesconto, 0);
  const totalPagamentosDivididos = pagamentosDivididos.reduce(
    (total, pagamento) => total + (Number(pagamento.valor) || 0),
    0
  );
  const restantePagamentoDividido = Math.round(
    (totalComDesconto - totalPagamentosDivididos) * 100
  ) / 100;

  function iniciarDivisaoPagamento() {
    const formaInicial = formaPagamento === "Fiado" ? "PIX" : formaPagamento;
    setPagamentosDivididos([{
      id: 0,
      formaPagamento: formaInicial,
      valor: totalComDesconto.toFixed(2),
    }]);
    setProximoPagamentoId(1);
    setDivisaoAtiva(true);
  }

  function adicionarPagamentoDividido() {
    if (pagamentosDivididos.length >= 2) return;

    setPagamentosDivididos((pagamentos) => [
      ...pagamentos,
      { id: proximoPagamentoId, formaPagamento: "Cartão de Débito", valor: "" },
    ]);
    setProximoPagamentoId((id) => id + 1);
  }

  function atualizarPagamentoDividido(id, campo, valor) {
    setPagamentosDivididos((pagamentos) =>
      pagamentos.map((pagamento) =>
        pagamento.id === id ? { ...pagamento, [campo]: valor } : pagamento
      )
    );
  }

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

    if (divisaoAtiva) {
      if (Math.abs(restantePagamentoDividido) > 0.009) {
        setMensagem("Distribua o valor total entre as formas de pagamento.");
      } else {
        setMensagem("A divisão está pronta nesta tela, mas o backend ainda não registra pagamentos divididos.");
      }
      return;
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
      setDesconto("")
      setValorRecebido("")
      setDivisaoAtiva(false)
      setPagamentosDivididos([])

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
      <header className="vendas-page-header">
        <div>
          <h1>Frente de Caixa</h1>
          <p>Registre produtos e finalize vendas com facilidade.</p>
        </div>
        <span className="nova-venda-status">
          <span className="nova-venda-status-indicador" aria-hidden="true" />
          Nova venda
        </span>
      </header>

      <div className="pdv-grid">
        <section className="produtos-venda-section">
          <div className="busca-produtos">
            <div className="produtos-venda-heading">
              <h2>Produtos</h2>
              <ShoppingCart size={20} aria-hidden="true" />
            </div>
            <div className="top-bar">
              <Buscar placeholder="Buscar por nome ou código..." onSearch={buscar} />
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

          <div className="carrinho-items">
            {carrinho.length === 0 ? (
              <section className="carrinho-vazio" role="status">
                <div className="carrinho-vazio-icone">
                  <ShoppingCart size={27} aria-hidden="true" />
                </div>
                <h3>Nenhum produto adicionado</h3>
                <p>Busque um produto para iniciar a venda.</p>
              </section>
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

          <div className="itens-carrinho-footer">
            <span>Itens no carrinho</span>
            <strong>{carrinho.length}</strong>
          </div>
        </section>

        <aside className="resumo-financeiro">
          <h2>Resumo da venda</h2>
          <div className="financeiro-linha">
            <span>Subtotal</span>
            <strong>R$ {totalCarrinho.toFixed(2)}</strong>
          </div>

          <label className="campo-desconto">
            Desconto (R$)
            <input
              type="number"
              min="0"
              max={totalCarrinho}
              step="0.01"
              value={desconto}
              onChange={(event) => setDesconto(event.target.value)}
              placeholder="0,00"
            />
          </label>

          <div className="financeiro-linha total-final">
            <span>Total</span>
            <strong>R$ {totalComDesconto.toFixed(2)}</strong>
          </div>

          <div className="pagamento-form">
            {!divisaoAtiva ? (
              <>
                <label htmlFor="forma-pagamento">Forma de pagamento</label>
                <select
                  id="forma-pagamento"
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

                {formaPagamento === "Dinheiro" && (
                  <>
                    <label htmlFor="valor-recebido">Valor recebido</label>
                    <input
                      id="valor-recebido"
                      className="input-recebido"
                      type="number"
                      min="0"
                      step="0.01"
                      value={valorRecebido}
                      onChange={(event) => setValorRecebido(event.target.value)}
                      placeholder="0,00"
                    />
                    <div className="financeiro-linha troco-display">
                      <span>Troco</span>
                      <strong>R$ {troco.toFixed(2)}</strong>
                    </div>
                  </>
                )}

                {formaPagamento === "Fiado" && (
                  <>
                    <label className="cliente-fiado-label" htmlFor="cliente-fiado">
                      <User size={16} aria-hidden="true" />
                      Cliente
                    </label>
                    <select
                      id="cliente-fiado"
                      className="select-pagamento"
                      value={clienteSelecionado}
                      onChange={(e) => setClienteSelecionado(e.target.value)}
                    >
                      <option value="">Selecione</option>
                      {clientes.map((cliente) => (
                        <option key={cliente.idCliente} value={cliente.idCliente}>
                          {cliente.nome}
                        </option>
                      ))}
                    </select>
                  </>
                )}

                <button
                  type="button"
                  className="btn-dividir-pagamento"
                  onClick={iniciarDivisaoPagamento}
                >
                  <Plus size={16} aria-hidden="true" />
                  Dividir pagamento
                </button>
              </>
            ) : (
              <div className="pagamentos-divididos">
                <div className="pagamentos-divididos-cabecalho">
                  <span>Formas de pagamento</span>
                  <button
                    type="button"
                    className="btn-pagamento-unico"
                    onClick={() => setDivisaoAtiva(false)}
                  >
                    Pagamento único
                  </button>
                </div>

                {pagamentosDivididos.map((pagamento, index) => (
                  <div className="pagamento-dividido-linha" key={pagamento.id}>
                    <label className="pagamento-dividido-forma">
                      <span>Forma {index + 1}</span>
                      <select
                        className="select-pagamento"
                        value={pagamento.formaPagamento}
                        onChange={(event) =>
                          atualizarPagamentoDividido(
                            pagamento.id,
                            "formaPagamento",
                            event.target.value
                          )
                        }
                      >
                        <option value="PIX">PIX</option>
                        <option value="Cartão de Crédito">Crédito</option>
                        <option value="Cartão de Débito">Débito</option>
                        <option value="Dinheiro">Dinheiro</option>
                      </select>
                    </label>

                    <label className="pagamento-dividido-valor">
                      <span>Valor</span>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={pagamento.valor}
                        onChange={(event) =>
                          atualizarPagamentoDividido(
                            pagamento.id,
                            "valor",
                            event.target.value
                          )
                        }
                        placeholder="0,00"
                      />
                    </label>

                    <button
                      type="button"
                      className="btn-remover-pagamento"
                      aria-label={`Remover forma ${index + 1}`}
                      disabled={pagamentosDivididos.length === 1}
                      onClick={() =>
                        setPagamentosDivididos((pagamentos) =>
                          pagamentos.filter((item) => item.id !== pagamento.id)
                        )
                      }
                    >
                      <Trash2 size={16} aria-hidden="true" />
                    </button>
                  </div>
                ))}

                <button
                  type="button"
                  className="btn-adicionar-pagamento"
                  onClick={adicionarPagamentoDividido}
                  disabled={pagamentosDivididos.length >= 2}
                >
                  <Plus size={16} aria-hidden="true" />
                  Adicionar forma
                </button>

                <div className="financeiro-linha divisao-restante">
                  <span>{restantePagamentoDividido > 0 ? "Falta" : "Excedente"}</span>
                  <strong>
                    R$ {Math.abs(restantePagamentoDividido).toFixed(2)}
                  </strong>
                </div>
              </div>
            )}
          </div>

          <button className="btn-finalizar" onClick={finalizarVenda}>
            <img src={iconMoney} alt="" />
            Finalizar Venda
          </button>
          {mensagem && <div className="mensagem-pdv">{mensagem}</div>}
        </aside>
      </div>
    </div>
  );
}

export default VendasPage;