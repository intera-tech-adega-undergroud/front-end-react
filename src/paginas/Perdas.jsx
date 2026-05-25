import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Buscar from "../componentes/Buscar";
import "./Perdas.css";

function PerdasPage() {
  const [perdas, setPerdas] = useState([
    {
      id: 1,
      nome: "Heineken 330ml",
      quantidade: 2,
      motivo: "Garrafa quebrada no recebimento",
      estoqueAtual: 48,
      prejuizo: 7.00,
      funcionario: "Junior"
    },
    {
      id: 2,
      nome: "Gelo Coco 200ml",
      quantidade: 5,
      motivo: "Embalagem furada",
      estoqueAtual: 95,
      prejuizo: 7.50,
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

  const usuarioLogado = "Junior";

  const [produtosBanco, setProdutosBanco] = useState([
    { id: 1, nome: "Heineken 330ml", estoque: 48, custo: 4.50, preco: 8.00 },
    { id: 2, nome: "Coca-Cola 2L", estoque: 24, custo: 6.00, preco: 12.00 },
    { id: 3, nome: "Vinho Tinto Casillero", estoque: 10, custo: 35.00, preco: 55.00 },
    { id: 4, nome: "Gelo Coco 200ml", estoque: 95, custo: 1.50, preco: 3.00 }
  ]);

  function buscar(texto) {
    if (!texto) {
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

    const produtosAtualizados = produtosBanco.map((p) =>
      p.id === produto.id ? { ...p, estoque: novoEstoque } : p
    );
    setProdutosBanco(produtosAtualizados);

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

      {modalAdicionar && createPortal(
        <div className="modal-fundo">
          <div className="modal-caixa">
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

            <div className="modal-botoes">
              <button onClick={() => setModalAdicionar(false)}>
                Cancelar
              </button>
              <button className="btn-salvar" onClick={adicionar}>
                Registrar
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}

export default PerdasPage;