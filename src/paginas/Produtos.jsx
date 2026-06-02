import { useEffect, useState } from "react";
import Buscar from "../componentes/Buscar";
import "../paginas/Produtos.css";

function ProductsPage() {
  const [produtos, setProdutos] = useState([]);
  const [mensagem, setMensagem] = useState("");

  const [modalEditar, setModalEditar] = useState(false);
  const [modalAdicionar, setModalAdicionar] = useState(false);
  const [modalSaida, setModalSaida] = useState(false);
  const [modalExcluir, setModalExcluir] = useState(false);

  const [produtoParaExcluir, setProdutoParaExcluir] = useState(null);

  const [buscaSaida, setBuscaSaida] = useState("");
  const [quantidadeSaida, setQuantidadeSaida] = useState("");
  const [produtoSaida, setProdutoSaida] = useState(null);
  const [erroSaida, setErroSaida] = useState("");

  const [formEditar, setFormEditar] = useState({
    nome: "",
    preco: "",
    embalagem: "",
    volumeMl: "",
    qtdMinima: "",
    qtdUnidade: "",
    categoria: "",
    idProduto: ""
  });

  const [formAdicionar, setFormAdicionar] = useState({
    nome: "",
    preco: "",
    embalagem: "ND",
    volumeMl: "",
    qtdMinima: "",
    qtdUnidade: "",
    categoria: ""
  });


  // --- BLOCO DE CARREGAMENTO ---

  async function carregarProdutos() {
    const token = localStorage.getItem('tokenAdega');

    try {
      const resposta = await fetch('http://localhost:8080/produtos', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!resposta.ok) {
        throw new Error("Erro ao buscar produtos");
      }

      const dados = await resposta.json();
      setProdutos(dados);
      console.log(dados);

    } catch (error) {
      console.error('Erro de conexão com o servidor.', error);
      setMensagem("Erro ao carregar produtos.");
    }
  }

  useEffect(() => {
    carregarProdutos();
  }, []);


  // --- FUNÇÃO DE BUSCA ---

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

  function abrirModalEditar(idProduto) {
    setModalEditar(true);
    const produto = produtos.find((p) => p.idProduto === idProduto);
    
    if (produto) {
      setFormEditar({
        nome: produto.nome || "",
        preco: produto.preco || "",
        embalagem: produto.embalagem || "ND",
        volumeMl: produto.volumeMl || "",
        qtdMinima: produto.qtdMinimo || "",
        qtdUnidade: produto.qtdUnidade || "",
        categoria: produto.categoria?.categoria || produto.categoria || "",
        idProduto: idProduto
      });
    }
  }


  // --- FUNÇÃO DE ATUALIZAR ---

  async function atualizar(idProduto) {
    const token = localStorage.getItem("tokenAdega");

    const produto = {
      nome: formEditar.nome,
      preco: Number(formEditar.preco),
      embalagem: formEditar.embalagem,
      volumeMl: Number(formEditar.volumeMl),
      qtdMinima: Number(formEditar.qtdMinima),
      qtdUnidade: Number(formEditar.qtdUnidade),
      categoria: formEditar.categoria
    };

    try {
      const respuesta = await fetch(`http://localhost:8080/produtos/${idProduto}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(produto)
      });

      if (!respuesta.ok) {
        throw new Error("Erro ao editar produto");
      }

      setMensagem("Produto editado com sucesso!");
      setModalEditar(false);
      
      carregarProdutos();

      setFormEditar({
        nome: "",
        preco: "",
        embalagem: "",
        volumeMl: "",
        qtdMinima: "",
        qtdUnidade: "",
        categoria: "",
        idProduto: ""
      });

    } catch (error) {
      console.error(error);
      setMensagem("Erro ao editar produto");
    }
  }


  // --- FUNÇÃO PARA ABRIR CONFIRMAÇÃO DE EXCLUSÃO ---
  function abrirModalExcluir(produto) {
    setProdutoParaExcluir(produto);
    setModalExcluir(true);
  }


  // --- FUNÇÃO DE EXCLUIR---

  async function confirmarExclusao() {
    if (!produtoParaExcluir) return;

    const token = localStorage.getItem("tokenAdega");
    const id = produtoParaExcluir.idProduto;

    try {
      const resposta = await fetch(`http://localhost:8080/produtos/${id}`, { 
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
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


  // --- FUNÇÃO DE ADICIONAR ---

  async function adicionar() {
    const token = localStorage.getItem("tokenAdega");

    const produto = {
      nome: formAdicionar.nome,
      preco: Number(formAdicionar.preco),
      embalagem: formAdicionar.embalagem,
      volumeMl: Number(formAdicionar.volumeMl),
      qtdMinima: Number(formAdicionar.qtdMinima),
      qtdUnidade: Number(formAdicionar.qtdUnidade), 
      categoria: formAdicionar.categoria
    };

    try {
      const resposta = await fetch("http://localhost:8080/produtos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(produto)
      });

      if (!resposta.ok) {
        throw new Error("Erro ao cadastrar produto");
      }

      setMensagem("Produto cadastrado com sucesso!");
      setModalAdicionar(false);
      
      carregarProdutos();

      setFormAdicionar({
        nome: "",
        preco: "",
        embalagem: "ND",
        volumeMl: "",
        qtdMinima: "",
        qtdUnidade: "",
        categoria: ""
      });

    } catch (error) {
      console.error(error);
      setMensagem("Erro ao cadastrar produto");
    }
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

          <div className="top-bar-buttons">
            <button
              className="btn-saida"
              onClick={() => {
                setModalSaida(true);
                setBuscaSaida("");
                setQuantidadeSaida("");
                setProdutoSaida(null);
                setErroSaida("");
              }}
            >
              − Registrar saída
            </button>
            <button
              className="btn-adicionar"
              onClick={() => setModalAdicionar(true)}
            >
              + Adicionar produto
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
              <tr key={item.idProduto}>
                <td>{item.nome}</td>
                <td>{item.estoque}</td>
                <td>R$ {item.custo}</td>
                <td>R$ {item.preco}</td>
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

        {modalEditar && (
          <div className="modal">
            <div className="modal-content">
              <h3>Editar Produto</h3>

              <input
                placeholder="Nome"
                value={formEditar.nome}
                onChange={(e) =>
                  setFormEditar({ ...formEditar, nome: e.target.value })
                }
              />

              <input
                type="number"
                placeholder="Preço"
                value={formEditar.preco}
                onChange={(e) =>
                  setFormEditar({ ...formEditar, preco: e.target.value })
                }
              />

              <select
                value={formEditar.embalagem}
                onChange={(e) =>
                  setFormEditar({ ...formEditar, embalagem: e.target.value })
                }
              >
                <option value="ND" disabled>Selecione uma Embalagem</option>
                <option value="GARRAFA">Garrafa</option>
                <option value="LATA">Lata</option>
              </select>

              <input
                type="number"
                placeholder="Volume (ml)"
                value={formEditar.volumeMl}
                onChange={(e) =>
                  setFormEditar({ ...formEditar, volumeMl: e.target.value })
                }
              />

              <input
                type="number"
                placeholder="Qtd mínima"
                value={formEditar.qtdMinima}
                onChange={(e) =>
                  setFormEditar({ ...formEditar, qtdMinima: e.target.value })
                }
              />

              <input
                type="number"
                placeholder="Qtd Unidade"
                value={formEditar.qtdUnidade}
                onChange={(e) =>
                  setFormEditar({ ...formEditar, qtdUnidade: e.target.value })
                }
              />

              <select
                value={formEditar.categoria}
                onChange={(e) =>
                  setFormEditar({ ...formEditar, categoria: e.target.value })
                }
              >
                <option value="" disabled>Selecione uma Categoria</option>
                <option value="BEBIDA_UNIDADE">Bebida Unidade</option>
                <option value="BEBIDA_FRACIONADA">Bebida Fracionada</option>
                <option value="DIVERSOS">Diversos</option>
                <option value="DRINK">Dose</option>
                <option value="COMBO">Combo</option>
              </select>

              <div className="modal-buttons">
                <button onClick={() => setModalEditar(false)}>Cancelar</button>
                <button className="btn-salvar" onClick={() => atualizar(formEditar.idProduto)}>
                  Salvar
                </button>
              </div>
            </div>
          </div>
        )}


        {/* MODAL SAÍDA */}

        {modalSaida && (
          <div className="modal">
            <div className="modal-content">
              <h3>Registrar Saída</h3>

              {!produtoSaida ? (
                <div className="saida-busca-wrapper">
                  <input
                    placeholder="Pesquisar produto..."
                    value={buscaSaida}
                    autoFocus
                    onChange={(e) => {
                      setBuscaSaida(e.target.value);
                      setErroSaida("");
                    }}
                  />
                  {buscaSaida && (
                    <ul className="saida-sugestoes">
                      {produtos.filter(p =>
                        p.nome.toLowerCase().includes(buscaSaida.toLowerCase())
                      ).length === 0 ? (
                        <li className="saida-sugestao-vazia">Nenhum produto encontrado</li>
                      ) : (
                        produtos
                          .filter(p => p.nome.toLowerCase().includes(buscaSaida.toLowerCase()))
                          .map(p => (
                            <li
                              key={p.idProduto}
                              className="saida-sugestao-item"
                              onClick={() => {
                                setProdutoSaida(p);
                                setBuscaSaida("");
                                setErroSaida("");
                              }}
                            >
                              <span>{p.nome}</span>
                              <span className="saida-estoque-atual">Estoque: {p.estoque}</span>
                            </li>
                          ))
                      )}
                    </ul>
                  )}
                </div>
              ) : (
                <div className="saida-produto-selecionado">
                  <div className="saida-produto-info">
                    <span>{produtoSaida.nome}</span>
                    <span className="saida-estoque-atual">Estoque atual: {produtoSaida.estoque}</span>
                  </div>
                  <button
                    type="button"
                    className="saida-trocar"
                    onClick={() => { setProdutoSaida(null); setQuantidadeSaida(""); setErroSaida(""); }}
                  >
                    Trocar
                  </button>
                </div>
              )}

              <input
                type="number"
                placeholder="Quantidade para saída"
                value={quantidadeSaida}
                min="1"
                onChange={(e) => {
                  setQuantidadeSaida(e.target.value);
                  setErroSaida("");
                }}
              />

              {erroSaida && <p className="saida-erro">{erroSaida}</p>}

              <div className="modal-buttons">
                <button onClick={() => setModalSaida(false)}>Cancelar</button>
                <button
                  className="btn-confirmar-saida"
                  onClick={() => {
                    if (!produtoSaida) {
                      setErroSaida("Selecione um produto válido.");
                      return;
                    }
                    const qtd = Number(quantidadeSaida);
                    if (!qtd || qtd <= 0) {
                      setErroSaida("Informe uma quantidade válida.");
                      return;
                    }
                    if (qtd > produtoSaida.estoque) {
                      setErroSaida("Quantidade maior que o estoque disponível.");
                      return;
                    }
                    setProdutos(produtos.map(p =>
                      p.idProduto === produtoSaida.idProduto
                        ? { ...p, estoque: p.estoque - qtd }
                        : p
                    ));
                    setModalSaida(false);
                    setMensagem(`Saída de ${qtd}x "${produtoSaida.nome}" registrada!`);
                  }}
                >
                  Confirmar saída
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
                placeholder="Preço"
                value={formAdicionar.preco}
                onChange={(e) =>
                  setFormAdicionar({ ...formAdicionar, preco: e.target.value })
                }
              />

              <select
                value={formAdicionar.embalagem}
                onChange={(e) =>
                  setFormAdicionar({ ...formAdicionar, embalagem: e.target.value })
                }
              >
                <option value="ND" disabled>Selecione uma Embalagem</option>
                <option value="GARRAFA">Garrafa</option>
                <option value="LATA">Lata</option>
              </select>

              <input
                type="number"
                placeholder="Volume (ml)"
                value={formAdicionar.volumeMl}
                onChange={(e) =>
                  setFormAdicionar({ ...formAdicionar, volumeMl: e.target.value })
                }
              />

              <input
                type="number"
                placeholder="Qtd mínima"
                value={formAdicionar.qtdMinima}
                onChange={(e) =>
                  setFormAdicionar({ ...formAdicionar, qtdMinima: e.target.value })
                }
              />

             
              <input
                type="number"
                placeholder="Qtd Unidade"
                value={formAdicionar.qtdUnidade}
                onChange={(e) =>
                  setFormAdicionar({ ...formAdicionar, qtdUnidade: e.target.value })
                }
              />

              <select
                value={formAdicionar.categoria}
                onChange={(e) =>
                  setFormAdicionar({ ...formAdicionar, categoria: e.target.value })
                }
              >
                <option value="" disabled>Selecione uma Categoria</option>
                <option value="BEBIDA_UNIDADE">Bebida Unidade</option>
                <option value="BEBIDA_FRACIONADA">Bebida Fracionada</option>
                <option value="DIVERSOS">Diversos</option>
                <option value="DRINK">Dose</option>
                <option value="COMBO">Combo</option>
              </select>

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


        {/* MODAL EXCLUIR */}

        {modalExcluir && (
          <div className="modal">
            <div className="modal-content">
              <h3>Excluir Produto</h3>
              <p>Tem certeza que deseja excluir o produto <strong>{produtoParaExcluir?.nome}</strong>?</p>
              <p style={{ color: "red", fontSize: "14px" }}>Esta ação não poderá ser desfeita.</p>
              
              <div className="modal-buttons">
                <button onClick={() => { setModalExcluir(false); setProdutoParaExcluir(null); }}>
                  Cancelar
                </button>
                <button 
                  className="btn-saida" 
                  style={{ backgroundColor: "#d9534f", color: "white" }} 
                  onClick={confirmarExclusao}
                >
                  Confirmar Exclusão
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