import { useState, useEffect } from "react";
import Buscar from "../componentes/Buscar";
import "./Perdas.css";

function PerdasPage() {
  const [perdas, setPerdas] = useState([]);
  const [modalAdicionar, setModalAdicionar] = useState(false);
  const [mensagem, setMensagem] = useState("");

  const [formAdicionar, setFormAdicionar] = useState({
    nome: "",
    quantidade: "",
    motivo: "",
  });

  /* 
     Simulação local do usuário logado
  */
  const usuarioLogado = "Junior";
  /*
  const usuarioLogado = localStorage.getItem("usuario");
  */

  /*
     Simulação do banco
*/
  const [produtosBanco, setProdutosBanco] = useState([
    { id: 1, nome: "Heineken", estoque: 50, custo: 4.0, preco: 7.0 },
    { id: 2, nome: "Budweiser", estoque: 40, custo: 3.5, preco: 6.0 },
    { id: 3, nome: "Corona", estoque: 30, custo: 5.0, preco: 9.0 },
    { id: 4, nome: "Skol", estoque: 60, custo: 2.8, preco: 5.5 },
  ]);

  /* Conexão com o backend
     */
  /*
  useEffect(() => {
    fetch("http://localhost:8080/produtos")
      .then((res) => res.json())
      .then((data) => setProdutosBanco(data))
      .catch((err) => console.error(err));
  }, []);
  */

  function buscar(texto) {
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
      return;
    }

    const quantidade = Number(formAdicionar.quantidade);

    if (quantidade > produto.estoque) {
      setMensagem("Quantidade maior que o estoque disponível!");
      return;
    }

    const novoEstoque = produto.estoque - quantidade;

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

    // Simulação de atualização no banco
    const produtosAtualizados = produtosBanco.map((p) =>
      p.id === produto.id ? { ...p, estoque: novoEstoque } : p
    );

    setProdutosBanco(produtosAtualizados);
    /* Atualiza o estoque
        fetch(`http://localhost:8080/produtos/${produto.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estoque: novoEstoque }),
        });
    */

   
       
    
    /*  Faz a inserção de uma nova perda
    fetch("http://localhost:8080/perdas", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(novaPerda),
    });
    */

    setModalAdicionar(false);
    setMensagem("Perda registrada com sucesso!");

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

            <input
              type="number"
              placeholder="Quantidade perdida"
              value={formAdicionar.quantidade}
              onChange={(e) =>
                setFormAdicionar({
                  ...formAdicionar,
                  quantidade: e.target.value,
                })
              }
            />

            <input
              placeholder="Motivo da perda"
              value={formAdicionar.motivo}
              onChange={(e) =>
                setFormAdicionar({
                  ...formAdicionar,
                  motivo: e.target.value,
                })
              }
            />

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