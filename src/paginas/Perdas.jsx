import { useState, useEffect } from "react";
import Buscar from "../componentes/Buscar";
import "./Perdas.css";

function PerdasPage() {
  // Simulação de dados já cadastrados de perdas
  const [perdas, setPerdas] = useState([
    {
      id: 1,
      nome: "Heineken 330ml",
      quantidade: 2,
      motivo: "Garrafa quebrada no recebimento",
      estoqueAtual: 48,
      prejuizo: 7.00, // (Preço 8.00 - Custo 4.50) * 2
      funcionario: "Junior"
    },
    {
      id: 2,
      nome: "Gelo Coco 200ml",
      quantidade: 5,
      motivo: "Embalagem furada",
      estoqueAtual: 95,
      prejuizo: 7.50, // (Preço 3.00 - Custo 1.50) * 5
      funcionario: "Junior"
    }
  ]);

  const [modalAdicionar, setModalAdicionar] = useState(false);
  const [mensagem, setMensagem] = useState("");

  const [formAdicionar, setFormAdicionar] = useState({
    nome: "",
    quantidade: "",
    motivo: "",
  });

  /* Simulação local do usuário logado */
  const usuarioLogado = "Junior";
  /* const usuarioLogado = localStorage.getItem("usuario"); */

  /* Simulação do banco - Padronizado com as outras telas */
  const [produtosBanco, setProdutosBanco] = useState([
    { id: 1, nome: "Heineken 330ml", estoque: 48, custo: 4.50, preco: 8.00 },
    { id: 2, nome: "Coca-Cola 2L", estoque: 24, custo: 6.00, preco: 12.00 },
    { id: 3, nome: "Vinho Tinto Casillero", estoque: 10, custo: 35.00, preco: 55.00 },
    { id: 4, nome: "Gelo Coco 200ml", estoque: 95, custo: 1.50, preco: 3.00 }
  ]);

  /* Conexão com o backend comentada para o futuro
  useEffect(() => {
    fetch("http://localhost:8080/produtos")
      .then((res) => res.json())
      .then((data) => setProdutosBanco(data))
      .catch((err) => console.error(err));
  }, []);
  */

  function buscar(texto) {
    if (!texto) {
      // Se apagar a busca, o ideal seria recarregar a lista original. 
      // Por enquanto, como é local, a busca filtra o estado atual.
      return;
    }
    const filtrados = perdas.filter((p) =>
      p.nome.toLowerCase().includes(texto.toLowerCase())
    );
    setPerdas(filtrados);
  }

  function adicionar() {
    const produto = produtosBanco.find(
      (p) => p.nome.toLowerCase() === formAdicionar.nome.toLowerCase()
    );

    if (!produto) {
      setMensagem("Produto não encontrado no estoque!");
      setTimeout(() => setMensagem(""), 3000);
      return;
    }

    const quantidade = Number(formAdicionar.quantidade);

    if (quantidade <= 0) {
      setMensagem("A quantidade deve ser maior que zero!");
      setTimeout(() => setMensagem(""), 3000);
      return;
    }

    if (quantidade > produto.estoque) {
      setMensagem("Quantidade maior que o estoque disponível!");
      setTimeout(() => setMensagem(""), 3000);
      return;
    }

    const novoEstoque = produto.estoque - quantidade;

    // Cálculo do prejuízo baseado na margem (deixou de ganhar)
    const prejuizoUnitario = produto.preco - produto.custo;
    const prejuizoTotal = prejuizoUnitario * quantidade;

    const novaPerda = {
      id: Math.random(),
      nome: produto.nome,
      quantidade,
      motivo: formAdicionar.motivo,
      estoqueAtual: novoEstoque,
      prejuizo: prejuizoTotal,
      funcionario: usuarioLogado,
    };

    setPerdas([...perdas, novaPerda]);

    // Simulação de atualização no banco local
    const produtosAtualizados = produtosBanco.map((p) =>
      p.id === produto.id ? { ...p, estoque: novoEstoque } : p
    );
    setProdutosBanco(produtosAtualizados);

    /* --- Integrações com Backend Comentadas ---
    fetch(`http://localhost:8080/produtos/${produto.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ estoque: novoEstoque }),
    });
    
    fetch("http://localhost:8080/perdas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(novaPerda),
    });
    */

    setModalAdicionar(false);
    setMensagem("Perda registrada com sucesso!");
    setTimeout(() => setMensagem(""), 3000);

    setFormAdicionar({
      nome: "",
      quantidade: "",
      motivo: "",
    });
  }

  return (
    <div className="perdas-container">
      <h1>Perdas</h1>

      <div className="top-bar">
        <Buscar placeholder="Buscar perda..." onSearch={buscar} />

        <button
          className="btn-adicionar"
          onClick={() => setModalAdicionar(true)}
        >
          + Registrar perda
        </button>
      </div>

      <table>
        <thead>
          <tr>
            <th>Produto</th>
            <th>Qtd perdida</th>
            <th>Motivo</th>
            <th>Estoque atual</th>
            <th>Prejuízo</th>
            <th>Funcionário</th>
          </tr>
        </thead>

        <tbody>
          {perdas.map((item) => (
            <tr key={item.id}>
              <td>{item.nome}</td>
              <td>{item.quantidade}</td>
              <td>{item.motivo}</td>
              <td>{item.estoqueAtual}</td>
              <td className="prejuizo">
                R$ {item.prejuizo.toFixed(2)}
              </td>
              <td>{item.funcionario}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mensagem">{mensagem}</div>

      {modalAdicionar && (
        <div className="modal">
          <div className="modal-content">
            <h3>Registrar Perda</h3>

            <div className="form-group">
              <label>Produto:</label>
              <input
                placeholder="Nome do produto"
                value={formAdicionar.nome}
                onChange={(e) =>
                  setFormAdicionar({
                    ...formAdicionar,
                    nome: e.target.value,
                  })
                }
              />
            </div>

            <div className="form-group">
              <label>Quantidade:</label>
              <input
                type="number"
                placeholder="Qtd perdida"
                value={formAdicionar.quantidade}
                onChange={(e) =>
                  setFormAdicionar({
                    ...formAdicionar,
                    quantidade: e.target.value,
                  })
                }
              />
            </div>

            <div className="form-group">
              <label>Motivo:</label>
              <input
                placeholder="Ex: Quebra, Vencimento..."
                value={formAdicionar.motivo}
                onChange={(e) =>
                  setFormAdicionar({
                    ...formAdicionar,
                    motivo: e.target.value,
                  })
                }
              />
            </div>

            <div className="modal-buttons">
              <button onClick={() => setModalAdicionar(false)}>
                Cancelar
              </button>
              <button className="btn-salvar" onClick={adicionar}>
                Registrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PerdasPage;