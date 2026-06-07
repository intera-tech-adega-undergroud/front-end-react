import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Buscar from "../componentes/Buscar";
import "../paginas/Produtos.css";

function ProductsPage() {
  const [produtos, setProdutos] = useState([]);
  const [mensagem, setMensagem] = useState("");

  const [modalEditar, setModalEditar] = useState(false);
  const [modalAdicionar, setModalAdicionar] = useState(false);
  const [modalAdicionarEstoque, setModalAdicionarEstoque] = useState(false);
  const [modalExcluir, setModalExcluir] = useState(false);

  const [produtoParaExcluir, setProdutoParaExcluir] = useState(null);

  const [formEditar, setFormEditar] = useState({
    nome: "",
    preco: "",
    embalagem: "",
    volumeMl: "",
    qtdMinima: "",
    qtdUnidade: "",
    categoria: "",
    idProduto: "",
  });

  const [formAdicionar, setFormAdicionar] = useState({
    nome: "",
    preco: "",
    embalagem: "",
    volumeMl: "",
    qtdMinima: "",
    qtdUnidade: "",
    categoria: "",
  });

  const [formAdicionarEstoque, setFormAdicionarEstoque] = useState({
    idProduto: "",
    quantidade: "",
  });

  async function carregarProdutos() {
    const token = localStorage.getItem("tokenAdega");

    try {
      const resposta = await fetch("http://localhost:8080/produtos", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!resposta.ok) {
        throw new Error("Erro ao buscar produtos");
      }

      const dados = await resposta.json();
      setProdutos(dados);
    } catch (error) {
      console.error("Erro de conexão com o servidor.", error);
      setMensagem("Erro ao carregar produtos.");
    }
  }

  useEffect(() => {
    carregarProdutos();
  }, []);

  async function buscar(texto) {
    if (!texto.trim()) {
      carregarProdutos();
      return;
    }

    const filtrados = produtos.filter((p) =>
      p.nome.toLowerCase().includes(texto.toLowerCase())
    );
    setProdutos(filtrados);
  }

  async function abrirModalEditar(idProduto) {
    const produto = produtos.find((p) => p.idProduto === idProduto);

    if (produto) {
      setFormEditar({
        nome: produto.nome || "",
        preco: produto.preco || "",
        embalagem: produto.embalagem || "ND",
        volumeMl: produto.volumeMl || "",
        qtdMinima: produto.qtdMinima || "",
        qtdUnidade: produto.qtdUnidade || "",
        categoria: produto.categoria?.categoria || produto.categoria || "",
        idProduto: idProduto,
      });
      setModalEditar(true);
    }
  }

  async function salvar() {
    const token = localStorage.getItem("tokenAdega");

    const produto = {
      nome: formEditar.nome,
      preco: Number(formEditar.preco),
      embalagem: formEditar.embalagem,
      volumeMl: Number(formEditar.volumeMl),
      qtdMinima: Number(formEditar.qtdMinima),
      qtdUnidade: Number(formEditar.qtdUnidade),
      categoria: formEditar.categoria,
    };

    try {
      const resposta = await fetch(
        `http://localhost:8080/produtos/${formEditar.idProduto}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(produto),
        }
      );

      if (!resposta.ok) {
        throw new Error("Erro ao editar produto");
      }

      setModalEditar(false);
      setMensagem("Produto editado com sucesso!");
      carregarProdutos();

      setFormEditar({
        nome: "",
        preco: "",
        embalagem: "",
        volumeMl: "",
        qtdMinima: "",
        qtdUnidade: "",
        categoria: "",
        idProduto: "",
      });
    } catch (error) {
      console.error(error);
      setMensagem("Erro ao editar produto.");
    }
  }

  function abrirModalExcluir(produto) {
    setProdutoParaExcluir(produto);
    setModalExcluir(true);
  }

  async function excluir() {
    if (!produtoParaExcluir) return;

    const token = localStorage.getItem("tokenAdega");
    const id = produtoParaExcluir.idProduto;

    try {
      const resposta = await fetch(`http://localhost:8080/produtos/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!resposta.ok) {
        throw new Error("Erro ao deletar produto no servidor.");
      }

      setMensagem("Produto excluído com sucesso!");
      setModalExcluir(false);
      setProdutoParaExcluir(null);
      carregarProdutos();
    } catch (error) {
      console.error(error);
      setMensagem("Erro ao excluir o produto do servidor.");
    }
  }

  async function adicionar() {
    const token = localStorage.getItem("tokenAdega");

    console.log("TOKEN:", token);

    if (!token) {
      setMensagem("Você precisa fazer login novamente.");
      return;
    }

    const produto = {
      nome: formAdicionar.nome,
      preco: Number(formAdicionar.preco),
      embalagem: formAdicionar.embalagem,
      volumeMl: Number(formAdicionar.volumeMl),
      qtdMinima: Number(formAdicionar.qtdMinima),
      qtdUnidade: Number(formAdicionar.qtdUnidade || 0),
      categoria: formAdicionar.categoria
    };

    console.log("PRODUTO ENVIADO:", produto);

    try {
      const resposta = await fetch("http://localhost:8080/produtos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(produto)
      });

      if (!resposta.ok) {
        const erroTexto = await resposta.text();
        console.log("ERRO BACKEND:", erroTexto);
        throw new Error("Erro ao cadastrar produto");
      }

      setMensagem("Produto cadastrado com sucesso!");
      setModalAdicionar(false);
      carregarProdutos();
    } catch (error) {
      console.error(error);
      setMensagem("Erro ao cadastrar produto");
    }
  }

  async function salvarAdicaoEstoque() {

    const token = localStorage.getItem("tokenAdega");

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

    try {
      const resposta = await fetch(
        `http://localhost:8080/produtos/${formAdicionarEstoque.idProduto}/entrada`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ quantidade: formAdicionarEstoque.quantidade }),
        }
      );

      if (!resposta.ok) {
        throw new Error("Erro ao adicionar estoque");
      }

      setModalAdicionarEstoque(false);
      setMensagem("Estoque abastecido com sucesso!");
      setFormAdicionarEstoque({ idProduto: "", quantidade: "" });

      carregarProdutos();

      setFormEditar({
        nome: "",
        preco: "",
        embalagem: "",
        volumeMl: "",
        qtdMinima: "",
        qtdUnidade: "",
        categoria: "",
        idProduto: "",
      });
    } catch (error) {
      console.error(error);
      setMensagem("Erro ao editar produto.");
    }


    setTimeout(() => setMensagem(""), 3000);
  }

  return (
    <div className="produtos-container">
      <h1>Produtos</h1>

      <div className="top-bar">
        <Buscar placeholder="Buscar por nome do produto..." onSearch={buscar} />

        <div className="top-bar-buttons">
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

        {/* Lista de Produtos */}

        <tbody>
          {produtos.map((item) => (
            <tr key={item.idProduto}>
              <td>{item.nome}</td>
              <td>{item.qtdUnidade}</td>
              <td>R$ {Number(item.custo || 0).toFixed(2)}</td>
              <td>R$ {Number(item.preco || 0).toFixed(2)}</td>
              <td>
                <button onClick={() => abrirModalEditar(item.idProduto)}>✏️</button>
                <button onClick={() => abrirModalExcluir(item)}>🗑</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mensagem">{mensagem}</div>

      {/* MODAL EDITAR */}
      {modalEditar &&
        createPortal(
          <div className="modal-fundo">
            <div className="modal-caixa">
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
                <label>Preço:</label>
                <input
                  type="number"
                  value={formEditar.preco}
                  onChange={(e) =>
                    setFormEditar({ ...formEditar, preco: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label>Embalagem:</label>
                <select
                  value={formEditar.embalagem}
                  onChange={(e) =>
                    setFormEditar({ ...formEditar, embalagem: e.target.value })
                  }
                >
                  <option value="ND" disabled>
                    Selecione uma Embalagem
                  </option>
                  <option value="GARRAFA">Garrafa</option>
                  <option value="LATA">Lata</option>
                </select>
              </div>

              <div className="form-group">
                <label>Volume (ml):</label>
                <input
                  type="number"
                  value={formEditar.volumeMl}
                  onChange={(e) =>
                    setFormEditar({ ...formEditar, volumeMl: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label>Qtd mínima:</label>
                <input
                  type="number"
                  value={formEditar.qtdMinima}
                  onChange={(e) =>
                    setFormEditar({ ...formEditar, qtdMinima: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label>Qtd unidade:</label>
                <input
                  type="number"
                  value={formEditar.qtdUnidade}
                  onChange={(e) =>
                    setFormEditar({ ...formEditar, qtdUnidade: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label>Categoria:</label>
                <select
                  value={formEditar.categoria}
                  onChange={(e) =>
                    setFormEditar({ ...formEditar, categoria: e.target.value })
                  }
                >
                  <option value="" disabled>
                    Selecione uma Categoria
                  </option>
                  <option value="BEBIDA_UNIDADE">Bebida Unidade</option>
                  <option value="BEBIDA_FRACIONADA">Bebida Fracionada</option>
                  <option value="DIVERSOS">Diversos</option>
                  <option value="DRINK">Dose</option>
                  <option value="COMBO">Combo</option>
                </select>
              </div>

              <div className="modal-botoes">
                <button onClick={() => setModalEditar(false)}>Cancelar</button>
                <button className="btn-salvar" onClick={salvar}>
                  Salvar
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* MODAL ADICIONAR NOVO PRODUTO */}
      {modalAdicionar &&
        createPortal(
          <div className="modal-fundo">
            <div className="modal-caixa">
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
                <label>Preço:</label>
                <input
                  type="number"
                  value={formAdicionar.preco}
                  onChange={(e) =>
                    setFormAdicionar({ ...formAdicionar, preco: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label>Embalagem:</label>
                <select
                  value={formAdicionar.embalagem}
                  onChange={(e) =>
                    setFormAdicionar({
                      ...formAdicionar,
                      embalagem: e.target.value,
                    })
                  }
                >
                  <option value="ND" disabled>
                    Selecione uma Embalagem
                  </option>
                  <option value="GARRAFA">Garrafa</option>
                  <option value="LATA">Lata</option>
                  <option value="Pacote">Pacote</option>

                </select>
              </div>

              <div className="form-group">
                <label>Volume (ml):</label>
                <input
                  type="number"
                  value={formAdicionar.volumeMl}
                  onChange={(e) =>
                    setFormAdicionar({
                      ...formAdicionar,
                      volumeMl: e.target.value,
                    })
                  }
                />
              </div>

              <div className="form-group">
                <label>Qtd mínima:</label>
                <input
                  type="number"
                  value={formAdicionar.qtdMinima}
                  onChange={(e) =>
                    setFormAdicionar({
                      ...formAdicionar,
                      qtdMinima: e.target.value,
                    })
                  }
                />
              </div>

              <div className="form-group">
                <label>Qtd unidade:</label>
                <input
                  type="number"
                  value={formAdicionar.qtdUnidade}
                  onChange={(e) =>
                    setFormAdicionar({
                      ...formAdicionar,
                      qtdUnidade: e.target.value,
                    })
                  }
                />
              </div>

              <div className="form-group">
                <label>Categoria:</label>
                <select
                  value={formAdicionar.categoria}
                  onChange={(e) =>
                    setFormAdicionar({
                      ...formAdicionar,
                      categoria: e.target.value,
                    })
                  }
                >
                  <option value="" disabled>
                    Selecione uma Categoria
                  </option>
                  <option value="BEBIDA_UNIDADE">Bebida Unidade</option>
                  <option value="BEBIDA_FRACIONADA">Bebida Fracionada</option>
                  <option value="DIVERSOS">Diversos</option>
                  <option value="DRINK">Dose</option>
                  <option value="COMBO">Combo</option>
                </select>
              </div>

              <div className="modal-botoes">
                <button onClick={() => setModalAdicionar(false)}>
                  Cancelar
                </button>
                <button className="btn-salvar" onClick={adicionar}>
                  Adicionar
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* MODAL ADICIONAR AO ESTOQUE (REPOSIÇÃO) */}
      {modalAdicionarEstoque &&
        createPortal(
          <div className="modal-fundo">
            <div className="modal-caixa">
              <h3>Adicionar ao Estoque</h3>

              <div className="form-group">
                <label>Nome:</label>
                <select
                  value={formAdicionarEstoque.idProduto}
                  onChange={(e) =>
                    setFormAdicionarEstoque({
                      ...formAdicionarEstoque,
                      idProduto: e.target.value,
                    })
                  }
                >
                  <option value="">Selecione um produto...</option>
                  {produtos.map((p) => (
                    <option key={p.idProduto} value={p.idProduto}>
                      {p.nome}
                    </option>
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
                    setFormAdicionarEstoque({
                      ...formAdicionarEstoque,
                      quantidade: e.target.value,
                    })
                  }
                />
              </div>

              <div className="modal-botoes">
                <button
                  onClick={() => {
                    setModalAdicionarEstoque(false);
                    setFormAdicionarEstoque({ idProduto: "", quantidade: "" });
                  }}
                >
                  Cancelar
                </button>
                <button className="btn-salvar" onClick={salvarAdicaoEstoque}>
                  Confirmar
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* MODAL EXCLUIR */}
      {modalExcluir &&
        createPortal(
          <div className="modal-fundo">
            <div className="modal-caixa">
              <h3>Excluir Produto</h3>
              <p>
                Tem certeza que deseja excluir o produto{" "}
                <strong>{produtoParaExcluir?.nome}</strong>?
              </p>
              <p style={{ color: "red", fontSize: "14px" }}>
                Esta ação não poderá ser desfeita.
              </p>

              <div className="modal-botoes">
                <button
                  onClick={() => {
                    setModalExcluir(false);
                    setProdutoParaExcluir(null);
                  }}
                >
                  Cancelar
                </button>
                <button
                  className="btn-add-estoque"
                  style={{ backgroundColor: "#d9534f", color: "white" }}
                  onClick={excluir}
                >
                  Confirmar Exclusão
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}

export default ProductsPage;
