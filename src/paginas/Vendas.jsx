import { useState, useEffect } from "react";
import Buscar from "../componentes/Buscar";
import "./Vendas.css";

function VendasPage() {
  // Simulação do banco de dados local
  const [produtosBanco, setProdutosBanco] = useState([
    { id: 1, nome: "Heineken 330ml", estoque: 50, custo: 4.50, preco: 8.00 },
    { id: 2, nome: "Coca-Cola 2L", estoque: 24, custo: 6.00, preco: 12.00 },
    { id: 3, nome: "Vinho Tinto Casillero", estoque: 10, custo: 35.00, preco: 55.00 },
    { id: 4, nome: "Gelo Coco 200ml", estoque: 100, custo: 1.50, preco: 3.00 }
  ]);

  const [resultadosBusca, setResultadosBusca] = useState([]);
  const [carrinho, setCarrinho] = useState([]);
  const [formaPagamento, setFormaPagamento] = useState("PIX");
  const [mensagem, setMensagem] = useState("");

  // --- CONEXÃO COM O BACKEND: CARREGAR PRODUTOS ---
  /*
  useEffect(() => {
    async function carregarProdutos() {
      try {
        const resposta = await fetch("http://localhost:8080/produtos");
        if (resposta.ok) {
          const dados = await resposta.json();
          setProdutosBanco(dados);
        }
      } catch (erro) {
        console.error("Erro ao buscar produtos do backend:", erro);
      }
    }
    carregarProdutos();
  }, []);
  */

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
    const itemExistente = carrinho.find(item => item.id === produto.id);
    
    if (itemExistente) {
      if (itemExistente.quantidade >= produto.estoque) {
        setMensagem(`Estoque insuficiente para ${produto.nome}!`);
        setTimeout(() => setMensagem(""), 3000);
        return;
      }
      const novoCarrinho = carrinho.map(item =>
        item.id === produto.id ? { ...item, quantidade: item.quantidade + 1 } : item
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
      if (item.id === id) {
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
    setCarrinho(carrinho.filter(item => item.id !== id));
  }

  // --- CALCULAR TOTAL ---
  const totalCarrinho = carrinho.reduce((acc, item) => acc + (item.preco * item.quantidade), 0);

  // --- FINALIZAR VENDA (ASYNC PARA BACKEND) ---
  async function finalizarVenda() {
    if (carrinho.length === 0) {
      setMensagem("O carrinho está vazio!");
      setTimeout(() => setMensagem(""), 3000);
      return;
    }

    // --- INTEGRAÇÃO COM O BACKEND (COMENTADA) ---
    /*
    try {
      // 1. Criar o objeto de venda para o histórico
      const novaVenda = {
        total: totalCarrinho,
        formaPagamento: formaPagamento,
        dataVenda: new Date().toISOString(),
        // funcionario: localStorage.getItem("usuario") || "Desconhecido", // Pega o logado futuramente
        itens: carrinho.map(item => ({
          produtoId: item.id,
          nome: item.nome,
          quantidade: item.quantidade,
          precoUnitario: item.preco
        }))
      };

      // 2. Registrar a venda na tabela de Vendas
      const respostaVenda = await fetch("http://localhost:8080/vendas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(novaVenda)
      });

      if (!respostaVenda.ok) throw new Error("Erro ao registrar a venda.");

      // 3. Abater o estoque de cada produto vendido
      for (const item of carrinho) {
        const produtoAtual = produtosBanco.find(p => p.id === item.id);
        const novoEstoque = produtoAtual.estoque - item.quantidade;

        await fetch(`http://localhost:8080/produtos/${item.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ estoque: novoEstoque })
        });
      }

      // 4. (Opcional) Recarregar a lista de produtos do banco para garantir sincronia
      // const resProdutos = await fetch("http://localhost:8080/produtos");
      // setProdutosBanco(await resProdutos.json());

    } catch (erro) {
      console.error(erro);
      setMensagem("Erro ao conectar com o servidor para finalizar a venda.");
      return; // Interrompe a função se der erro no banco
    }
    */

    // --- SIMULAÇÃO LOCAL (Abate do estoque simulado) ---
    const bancoAtualizado = produtosBanco.map(prod => {
      const itemVendido = carrinho.find(c => c.id === prod.id);
      if (itemVendido) {
        return { ...prod, estoque: prod.estoque - itemVendido.quantidade };
      }
      return prod;
    });

    // Limpa a tela e mostra sucesso
    setProdutosBanco(bancoAtualizado);
    setCarrinho([]);
    setResultadosBusca([]);
    setMensagem(`Venda de R$ ${totalCarrinho.toFixed(2)} finalizada com sucesso via ${formaPagamento}!`);
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
                  <tr key={produto.id}>
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
                    <tr key={item.id}>
                      <td>{item.nome}</td>
                      <td className="qtd-controls">
                        <button onClick={() => alterarQuantidade(item.id, -1)}>−</button>
                        <span>{item.quantidade}</span>
                        <button onClick={() => alterarQuantidade(item.id, 1)}>+</button>
                      </td>
                      <td>R$ {(item.preco * item.quantidade).toFixed(2)}</td>
                      <td>
                        <button className="btn-remover" onClick={() => removerDoCarrinho(item.id)}>🗑</button>
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