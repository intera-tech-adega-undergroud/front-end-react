import { useEffect, useState } from "react";
import Buscar from "../componentes/Buscar";
import "../paginas/Produtos.css";

function ProductsPage() {
  const [produtos, setProdutos] = useState([]);
  const [mensagem, setMensagem] = useState("");

  const [modalEditar, setModalEditar] = useState(false);
  const [modalAdicionar, setModalAdicionar] = useState(false);

  const [produtoSelecionado, setProdutoSelecionado] = useState(null);

  const [formEditar, setFormEditar] = useState({
    nome: "",
    estoque: "",
    custo: "",
    preco: "",
  });

  const [formAdicionar, setFormAdicionar] = useState({
    nome: "",
    estoque: "",
    custo: "",
    preco: "",
  });

  // --- BLOCO DE CARREGAMENTO ---
  async function carregarProdutos() {
    /* COMENTADO POR FALTA DE BACKEND
    const resposta = await fetch("http://localhost:8080/produtos");
    const dados = await resposta.json();
    setProdutos(dados);
    */
    console.log("Simulação: Carregamento ignorado (sem backend)");
  }

  useEffect(() => {
    carregarProdutos();
  }, []);

  // --- FUNÇÃO DE BUSCA ---
  async function buscar(texto) {
    /* COMENTADO POR FALTA DE BACKEND
    const resposta = await fetch("http://localhost:8080/produtos");
    const dados = await resposta.json();
    const filtrados = dados.filter((p) =>
      p.nome.toLowerCase().includes(texto.toLowerCase())
    );
    setProdutos(filtrados);
    */

    // Versão Simulação Local
    const filtrados = produtos.filter((p) =>
        p.nome.toLowerCase().includes(texto.toLowerCase())
    );
    setProdutos(filtrados);
  }

  // --- FUNÇÕES DE EDITAR ---
  async function abrirModalEditar(id) {
    /* COMENTADO POR FALTA DE BACKEND
    const resposta = await fetch(`http://localhost:8080/produtos/${id}`);
    const produto = await resposta.json();
    setProdutoSelecionado(id);
    setFormEditar(produto);
    setModalEditar(true);
    */

    // Versão Simulação Local
    const produto = produtos.find(p => p.id === id);
    if (produto) {
        setProdutoSelecionado(id);
        setFormEditar(produto);
        setModalEditar(true);
    }
  }

  async function salvar() {
    /* COMENTADO POR FALTA DE BACKEND
    const resposta = await fetch(
      `http://localhost:8080/produtos/${produtoSelecionado}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formEditar,
          estoque: Number(formEditar.estoque),
          custo: Number(formEditar.custo),
          preco: Number(formEditar.preco),
        }),
      }
    );

    if (resposta.ok) {
      setModalEditar(false);
      carregarProdutos();
      setMensagem("Produto atualizado!");
    }
    */

    // Versão Simulação Local
    const listaAtualizada = produtos.map(p => {
        if (p.id === produtoSelecionado) {
            return { ...formEditar, id: p.id };
        }
        return p;
    });
    setProdutos(listaAtualizada);
    setModalEditar(false);
    setMensagem("Produto atualizado (Local)!");
  }

  // --- FUNÇÃO DE EXCLUIR ---
  async function excluir(id) {
    /* COMENTADO POR FALTA DE BACKEND
    const resposta = await fetch(
      `http://localhost:8080/produtos/${id}`,
      { method: "DELETE" }
    );

    if (resposta.ok) {
      carregarProdutos();
      setMensagem("Produto excluído!");
    }
    */

    // Versão Simulação Local
    const novaLista = produtos.filter(p => p.id !== id);
    setProdutos(novaLista);
    setMensagem("Produto excluído (Local)!");
  }

  // --- FUNÇÕES DE ADICIONAR ---
  /* COMENTADO POR FALTA DE BACKEND
  async function adicionar() {
    const resposta = await fetch("http://localhost:8080/produtos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...formAdicionar,
        estoque: Number(formAdicionar.estoque),
        custo: Number(formAdicionar.custo),
        preco: Number(formAdicionar.preco),
      }),
    });

    if (resposta.ok) {
      setModalAdicionar(false);
      carregarProdutos();
      setMensagem("Produto adicionado!");
    }
  }
  */

  function adicionar() {
    const novoProduto = {
      ...formAdicionar,
      id: Math.random(),
      estoque: Number(formAdicionar.estoque),
      custo: Number(formAdicionar.custo),
      preco: Number(formAdicionar.preco),
    };

    setProdutos([...produtos, novoProduto]);
    setModalAdicionar(false);
    setMensagem("Produto adicionado com sucesso (Local)!");
    setFormAdicionar({ nome: "", estoque: "", custo: "", preco: "" });
  }

  return (
    <>
  
    <div className="produtos-container">
      <h1>Produtos</h1>

      <div className="top-bar">
        <Buscar
          placeholder="Buscar por nome do produto..."
          onSearch={buscar}
        />

        <button
          className="btn-adicionar"
          onClick={() => setModalAdicionar(true)}
        >
          + Adicionar produto
        </button>
      </div>

      <table>
        <thead>
          <tr>
            <th>Produto</th>
            <th>Estoque</th>
            <th>Preço de custo</th>
            <th>Preço de venda</th>
            <th>Ações</th>
          </tr>
        </thead>

        <tbody>
          {produtos.map((item) => (
            <tr key={item.id}>
              <td>{item.nome}</td>
              <td>{item.estoque}</td>
              <td>R$ {item.custo}</td>
              <td>R$ {item.preco}</td>
              <td>
                <button onClick={() => abrirModalEditar(item.id)}>✏️</button>
                <button onClick={() => excluir(item.id)}>🗑</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mensagem">{mensagem}</div>

      {/* MODAL EDITAR */}
      {modalEditar && (
        <div className="modal">
          <div className="modal-content">
            <h3>Editar Produto</h3>

            <input
              value={formEditar.nome}
              onChange={(e) =>
                setFormEditar({ ...formEditar, nome: e.target.value })
              }
              placeholder="Nome"
            />

            <input
              type="number"
              value={formEditar.estoque}
              onChange={(e) =>
                setFormEditar({ ...formEditar, estoque: e.target.value })
              }
              placeholder="Estoque"
            />

            <input
              type="number"
              value={formEditar.custo}
              onChange={(e) =>
                setFormEditar({ ...formEditar, custo: e.target.value })
              }
              placeholder="Custo"
            />

            <input
              type="number"
              value={formEditar.preco}
              onChange={(e) =>
                setFormEditar({ ...formEditar, preco: e.target.value })
              }
              placeholder="Preço"
            />

            <div className="modal-buttons">
              <button onClick={() => setModalEditar(false)}>Cancelar</button>
              <button className="btn-salvar" onClick={salvar}>
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL ADICIONAR */}
      {modalAdicionar && (
        <div className="modal">
          <div className="modal-content">
            <h3>Novo Produto</h3>

            <input
              placeholder="Nome"
              value={formAdicionar.nome}
              onChange={(e) =>
                setFormAdicionar({ ...formAdicionar, nome: e.target.value })
              }
            />

            <input
              type="number"
              placeholder="Estoque"
              value={formAdicionar.estoque}
              onChange={(e) =>
                setFormAdicionar({
                  ...formAdicionar,
                  estoque: e.target.value,
                })
              }
            />

            <input
              type="number"
              placeholder="Custo"
              value={formAdicionar.custo}
              onChange={(e) =>
                setFormAdicionar({ ...formAdicionar, custo: e.target.value })
              }
            />

            <input
              type="number"
              placeholder="Preço"
              value={formAdicionar.preco}
              onChange={(e) =>
                setFormAdicionar({ ...formAdicionar, preco: e.target.value })
              }
            />

            <div className="modal-buttons">
              <button onClick={() => setModalAdicionar(false)}>
                Cancelar
              </button>
              <button className="btn-salvar" onClick={adicionar}>
                Adicionar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
}

export default ProductsPage;