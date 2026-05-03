import { useEffect, useState } from "react";
import Buscar from "../componentes/Buscar";
import "../paginas/Produtos.css";

function ProductsPage() {
  // Dados de teste para não precisar cadastrar toda vez que der F5
  const [produtos, setProdutos] = useState([
    { id: 1, nome: "Heineken 330ml", estoque: 50, custo: 4.50, preco: 8.00 },
    { id: 2, nome: "Coca-Cola 2L", estoque: 24, custo: 6.00, preco: 12.00 },
    { id: 3, nome: "Vinho Tinto Casillero", estoque: 10, custo: 35.00, preco: 55.00 }
  ]);

  const [mensagem, setMensagem] = useState("");

  const [modalEditar, setModalEditar] = useState(false);
  const [modalAdicionar, setModalAdicionar] = useState(false);
  const [modalAdicionarEstoque, setModalAdicionarEstoque] = useState(false);

  const [produtoSelecionado, setProdutoSelecionado] = useState(null);


  const [formEditar, setFormEditar] = useState({
    nome: "",
    custo: "",
    preco: "",
  });

  const [formAdicionar, setFormAdicionar] = useState({
    nome: "",
    estoque: "",
    custo: "",
    preco: "",
  });

  // Formulário para a nova função de repor estoque
  const [formAdicionarEstoque, setFormAdicionarEstoque] = useState({
    idProduto: "",
    quantidade: "",
  });

  // --- BLOCO DE CARREGAMENTO ---
  async function carregarProdutos() {
    console.log("Simulação: Carregamento ignorado (sem backend)");
  }

  useEffect(() => {
    carregarProdutos();
  }, []);

  // --- FUNÇÃO DE BUSCA ---
  async function buscar(texto) {
    const filtrados = produtos.filter((p) =>
      p.nome.toLowerCase().includes(texto.toLowerCase())
    );
    setProdutos(filtrados);
  }

  // --- FUNÇÕES DE EDITAR ---
  async function abrirModalEditar(id) {
    const produto = produtos.find(p => p.id === id);
    if (produto) {
      setProdutoSelecionado(id);
      // Passamos apenas os campos permitidos para edição
      setFormEditar({
        nome: produto.nome,
        custo: produto.custo,
        preco: produto.preco
      });
      setModalEditar(true);
    }
  }

  async function salvar() {
    const listaAtualizada = produtos.map(p => {
      if (p.id === produtoSelecionado) {
        // Mantém o estoque original do produto, atualiza o resto
        return { 
          ...p, 
          nome: formEditar.nome,
          custo: Number(formEditar.custo),
          preco: Number(formEditar.preco)
        };
      }
      return p;
    });
    setProdutos(listaAtualizada);
    setModalEditar(false);
    setMensagem("Produto atualizado (Local)!");
  }

  // --- FUNÇÃO DE EXCLUIR ---
  async function excluir(id) {
    const novaLista = produtos.filter(p => p.id !== id);
    setProdutos(novaLista);
    setMensagem("Produto excluído (Local)!");
  }

  // --- FUNÇÕES DE ADICIONAR PRODUTO NOVO ---
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

  // --- FUNÇÃO DE ADICIONAR AO ESTOQUE (REPOSIÇÃO) ---
  function salvarAdicaoEstoque() {
    if (!formAdicionarEstoque.idProduto || !formAdicionarEstoque.quantidade) {
      setMensagem("Preencha o produto e a quantidade para repor o estoque.");
      setTimeout(() => setMensagem(""), 3000);
      return;
    }

    const qtdAdicionada = Number(formAdicionarEstoque.quantidade);
    
    if (qtdAdicionada <= 0) {
      setMensagem("A quantidade deve ser maior que zero.");
      setTimeout(() => setMensagem(""), 3000);
      return;
    }

    const listaAtualizada = produtos.map(p => {
      if (p.id === Number(formAdicionarEstoque.idProduto)) {
        return { ...p, estoque: p.estoque + qtdAdicionada };
      }
      return p;
    });

    setProdutos(listaAtualizada);
    setModalAdicionarEstoque(false);
    setMensagem("Estoque abastecido com sucesso!");
    setFormAdicionarEstoque({ idProduto: "", quantidade: "" });
    
    // Ocultar mensagem após um tempo
    setTimeout(() => setMensagem(""), 3000);
  }

  return (
    <div className="produtos-container">
      <h1>Produtos</h1>

      <div className="top-bar">
        <Buscar
          placeholder="Buscar por nome do produto..."
          onSearch={buscar}
        />

        <div className="top-bar-buttons">
          {/* Novo botão de reposição de estoque */}
          <button
            className="btn-add-estoque"
            onClick={() => setModalAdicionarEstoque(true)}
          >
            📦 Adicionar ao estoque
          </button>
          <button
            className="btn-adicionar"
            onClick={() => setModalAdicionar(true)}
          >
            + Novo produto
          </button>
        </div>
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
              <td>R$ {item.custo.toFixed(2)}</td>
              <td>R$ {item.preco.toFixed(2)}</td>
              <td>
                <button onClick={() => abrirModalEditar(item.id)}>✏️</button>
                <button onClick={() => excluir(item.id)}>🗑</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mensagem">{mensagem}</div>

      {/* MODAL EDITAR (Sem o campo de estoque) */}
      {modalEditar && (
        <div className="modal">
          <div className="modal-content">
            <h3>Editar Produto</h3>

            <div className="form-group">
              <label>Nome:</label>
              <input
                value={formEditar.nome}
                onChange={(e) =>
                  setFormEditar({ ...formEditar, nome: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label>Custo:</label>
              <input
                type="number"
                value={formEditar.custo}
                onChange={(e) =>
                  setFormEditar({ ...formEditar, custo: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label>Preço:</label>
              <input
                type="number"
                value={formEditar.preco}
                onChange={(e) =>
                  setFormEditar({ ...formEditar, preco: e.target.value })
                }
              />
            </div>

            <div className="modal-buttons">
              <button onClick={() => setModalEditar(false)}>Cancelar</button>
              <button className="btn-salvar" onClick={salvar}>
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL ADICIONAR NOVO PRODUTO */}
      {modalAdicionar && (
        <div className="modal">
          <div className="modal-content">
            <h3>Novo Produto</h3>

            <div className="form-group">
              <label>Nome:</label>
              <input
                value={formAdicionar.nome}
                onChange={(e) =>
                  setFormAdicionar({ ...formAdicionar, nome: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label>Estoque Inicial:</label>
              <input
                type="number"
                value={formAdicionar.estoque}
                onChange={(e) =>
                  setFormAdicionar({ ...formAdicionar, estoque: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label>Custo:</label>
              <input
                type="number"
                value={formAdicionar.custo}
                onChange={(e) =>
                  setFormAdicionar({ ...formAdicionar, custo: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label>Preço:</label>
              <input
                type="number"
                value={formAdicionar.preco}
                onChange={(e) =>
                  setFormAdicionar({ ...formAdicionar, preco: e.target.value })
                }
              />
            </div>

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

      {/* MODAL ADICIONAR AO ESTOQUE (REPOSIÇÃO) */}
      {modalAdicionarEstoque && (
        <div className="modal">
          <div className="modal-content">
            <h3>Adicionar ao Estoque</h3>

            <div className="form-group">
              <label>Nome:</label>
              {/* Usando um select para garantir que o usuário escolha um produto que já existe */}
              <select
                value={formAdicionarEstoque.idProduto}
                onChange={(e) => 
                  setFormAdicionarEstoque({ ...formAdicionarEstoque, idProduto: e.target.value })
                }
              >
                <option value="">Selecione um produto...</option>
                {produtos.map(p => (
                  <option key={p.id} value={p.id}>{p.nome}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Quantidade:</label>
              <input
                type="number"
                min="1"
                value={formAdicionarEstoque.quantidade}
                onChange={(e) =>
                  setFormAdicionarEstoque({ ...formAdicionarEstoque, quantidade: e.target.value })
                }
              />
            </div>

            <div className="modal-buttons">
              <button onClick={() => {
                setModalAdicionarEstoque(false);
                setFormAdicionarEstoque({ idProduto: "", quantidade: "" });
              }}>
                Cancelar
              </button>
              <button className="btn-salvar" onClick={salvarAdicaoEstoque}>
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductsPage;