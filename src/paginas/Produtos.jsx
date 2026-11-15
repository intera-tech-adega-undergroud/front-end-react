import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { FileText, Upload, X } from "lucide-react";
import Buscar from "../componentes/Buscar";
import iconCaixaEstoque from "../assets/iconCaixaEstoque.png";
import "../paginas/Produtos.css";
import iconCaixa from "../assets/iconCaixa.png";
import api, { textoDoErro, API_TIMEOUT_UPLOAD_MS } from "../services/api";

function ProductsPage() {
  const [produtos, setProdutos] = useState([]);
  const [mensagem, setMensagem] = useState("");

  const [modalEditar, setModalEditar] = useState(false);
  const [modalAdicionar, setModalAdicionar] = useState(false);
  const [modalAdicionarEstoque, setModalAdicionarEstoque] = useState(false);
  const [modalExcluir, setModalExcluir] = useState(false);
  const [confirmarSaidaProduto, setConfirmarSaidaProduto] = useState(false);
  const [modalProdutoOrigem, setModalProdutoOrigem] = useState(null);

  const [modalNotaFiscal, setModalNotaFiscal] = useState(false);
  const [arquivoNotaFiscal, setArquivoNotaFiscal] = useState(null);
  const [arrastandoArquivo, setArrastandoArquivo] = useState(false);
  const [textoNotaFiscal, setTextoNotaFiscal] = useState("");
  const [carregandoNotaFiscal, setCarregandoNotaFiscal] = useState(false);
  const [itensNotaFiscal, setItensNotaFiscal] = useState([]);

  const [confirmarSaidaNF, setConfirmarSaidaNF] = useState(false);
  const [paginaAtual, setPaginaAtual] = useState(1);

  const produtosPorPagina = 5;

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
      const resposta = await api.get("/produtos", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProdutos(resposta.data);
    } catch (error) {
      if (error.response) {
        console.log("STATUS PRODUTOS:", error.response.status);
        console.log("ERRO BACKEND PRODUTOS:", textoDoErro(error.response.data));
      }
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
      await api.put(`/produtos/${formEditar.idProduto}`, produto, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

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
      await api.delete(`/produtos/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

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
      categoria: formAdicionar.categoria,
    };

    console.log("PRODUTO ENVIADO:", produto);

    try {
      await api.post("/produtos", produto, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMensagem("Produto cadastrado com sucesso!");
      setModalAdicionar(false);
      carregarProdutos();
    } catch (error) {
      if (error.response) {
        console.log("ERRO BACKEND:", textoDoErro(error.response.data));
      }
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
      await api.patch(
        `/produtos/${formAdicionarEstoque.idProduto}/entrada`,
        { quantidade: formAdicionarEstoque.quantidade },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

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

  function selecionarArquivoNotaFiscal(arquivo) {
    if (!arquivo) return;

    const tipoAceito =
      arquivo.type === "application/pdf" ||
      arquivo.type.startsWith("image/") ||
      /\.(pdf|png|jpe?g|gif|webp|bmp)$/i.test(arquivo.name);

    if (tipoAceito) {
      setArquivoNotaFiscal(arquivo);
      setMensagem("");
    }
  }

  function receberArquivoNotaFiscal(event) {
    event.preventDefault();
    setArrastandoArquivo(false);
    selecionarArquivoNotaFiscal(event.dataTransfer.files?.[0]);
  }

  async function lerNotaFiscal() {
    if (!arquivoNotaFiscal) {
      setMensagem("Selecione uma imagem ou PDF da nota fiscal.");
      return;
    }

    const token = localStorage.getItem("tokenAdega");

    const formData = new FormData();
    formData.append("arquivo", arquivoNotaFiscal);

    try {
      setCarregandoNotaFiscal(true);
      setMensagem("Lendo nota fiscal...");

      // O Axios define o Content-Type multipart (com boundary) automaticamente para FormData
      const resposta = await api.post("/notas-fiscais/ocr", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        timeout: API_TIMEOUT_UPLOAD_MS,
      });

      const dados = resposta.data;

      setTextoNotaFiscal(dados.textoExtraido);
      identificarProdutosNaNota(dados.textoExtraido);

      setMensagem("Nota fiscal lida com sucesso!");
    } catch (error) {
      console.error(error);
      setMensagem("Erro ao processar nota fiscal.");
    } finally {
      setCarregandoNotaFiscal(false);
    }
  }

  function normalizarTexto(texto) {
    return String(texto || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function normalizarTexto(texto) {
    return String(texto || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function removerPalavrasGenericas(texto) {
    const palavrasGenericas = [
      "cerveja",
      "refrigerante",
      "vodka",
      "whisky",
      "energetico",
      "bebida",
      "lata",
      "garrafa",
      "long",
      "neck",
      "ml",
      "l",
      "un",
      "unidade",
      "quantidade",
    ];

    return normalizarTexto(texto)
      .split(" ")
      .filter((palavra) => !palavrasGenericas.includes(palavra))
      .join(" ");
  }

  function extrairQuantidade(linhas, indexProduto) {
    const linhaAtual = linhas[indexProduto] || "";
    const proximaLinha = linhas[indexProduto + 1] || "";

    const matchQuantidadeProxima = proximaLinha.match(/quantidade\s*[:\-]?\s*(\d+)/i);

    if (matchQuantidadeProxima) {
      return Number(matchQuantidadeProxima[1]);
    }

    const numerosLinhaAtual = linhaAtual.match(/\d+/g);

    if (numerosLinhaAtual && numerosLinhaAtual.length > 0) {
      return Number(numerosLinhaAtual[numerosLinhaAtual.length - 1]);
    }

    return 1;
  }

  function identificarProdutosNaNota(texto) {
    const linhas = texto
      .split("\n")
      .map((linha) => linha.trim())
      .filter((linha) => linha.length > 0);

    const encontrados = [];

    produtos.forEach((produto) => {
      const nomeProdutoSemGenericos = removerPalavrasGenericas(produto.nome);

      const indexProduto = linhas.findIndex((linha) => {
        const linhaSemGenericos = removerPalavrasGenericas(linha);

        if (!linhaSemGenericos || !nomeProdutoSemGenericos) return false;

        const palavrasProduto = nomeProdutoSemGenericos.split(" ");

        return palavrasProduto.some((palavra) =>
          linhaSemGenericos.includes(palavra)
        );
      });

      if (indexProduto !== -1) {
        const quantidade = extrairQuantidade(linhas, indexProduto);

        encontrados.push({
          idProduto: produto.idProduto,
          nome: produto.nome,
          quantidade,
          estoqueAtual: produto.qtdUnidade,
          novoEstoque: produto.qtdUnidade + quantidade,
        });
      }
    });

    console.log("ENCONTRADOS:", encontrados);
    setItensNotaFiscal(encontrados);

    if (encontrados.length === 0) {
      setMensagem("Nenhum produto cadastrado foi encontrado na nota fiscal.");
    }
  }

  async function confirmarEntradaNotaFiscal() {
    const token = localStorage.getItem("tokenAdega");

    if (itensNotaFiscal.length === 0) {
      setMensagem("Nenhum produto correspondente foi encontrado na nota.");
      setTimeout(() => setMensagem(""), 3000);
      return;
    }

    try {
      for (const item of itensNotaFiscal) {
        try {
          await api.patch(
            `/produtos/${item.idProduto}/entrada`,
            { quantidade: item.quantidade },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
        } catch (erro) {
          throw new Error(`Erro ao atualizar estoque de ${item.nome}`, { cause: erro });
        }
      }

      setMensagem("Estoque atualizado com sucesso pela nota fiscal!");
      setTimeout(() => setMensagem(""), 3000);

      setModalNotaFiscal(false);
      setArquivoNotaFiscal(null);
      setTextoNotaFiscal("");
      setItensNotaFiscal([]);

      carregarProdutos();
    } catch (error) {
      console.error(error);
      setMensagem("Erro ao atualizar estoque pela nota fiscal.");
    }

  }

  const totalPaginas = Math.ceil(produtos.length / produtosPorPagina);

  const indiceInicial = (paginaAtual - 1) * produtosPorPagina;
  const indiceFinal = indiceInicial + produtosPorPagina;

  const produtosPaginados = produtos.slice(indiceInicial, indiceFinal);

  return (
    <div className="produtos-container">
      <div className="section-produto">
        <h1 className="titulo">Produtos</h1>
        <p className="paragrafo">Gerencie os produtos, estoques da sua adega.</p>
      </div>
      

      <div className="top-bar">
        <Buscar placeholder="Buscar por nome do produto..." onSearch={buscar} />

        <div className="top-bar-buttons">
          <button
            className="btn-add-nf"
            onClick={() => setModalNotaFiscal(true)}
          >
            🧾 Ler Nota Fiscal
          </button>

          <button
            className="btn-add-estoque"
            onClick={() => setModalAdicionarEstoque(true)}
          >
            <img className="icon-repor-estoque" src={iconCaixaEstoque} alt="" />
            Repor Estoque
          </button>

          <button
            className="btn-adicionar"
            onClick={() => setModalAdicionar(true)}
          >
            + Cadastrar produto
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
          {mensagem === "Erro ao carregar produtos." ? (
            <tr>
              <td colSpan="5">
                <section className="estado-erro-produtos" role="alert">
                  <div className="estado-erro-produtos-icone">
                    <img src={iconCaixa} alt="" />
                  </div>
                  <h2>Erro ao carregar produtos</h2>
                  <p>Não foi possível carregar os produtos agora. Tente novamente em instantes.</p>
                </section>
              </td>
            </tr>
          ) : (
            produtosPaginados.map((item) => (
                <tr key={item.idProduto}>
                  <td>{item.nome}</td>
                  <td>{item.qtdUnidade}</td>
                  <td>R$ {Number(item.custo || 0).toFixed(2)}</td>
                  <td>R$ {Number(item.preco || 0).toFixed(2)}</td>
                  <td>
                    <button onClick={() => abrirModalEditar(item.idProduto)}>
                      ✏️
                    </button>
                    <button onClick={() => abrirModalExcluir(item)}>🗑</button>
                  </td>
                </tr>
            ))
          )}
        </tbody>
      </table>

      {totalPaginas > 1 && (
        <div className="paginacao-produtos">
          <button
            disabled={paginaAtual === 1}
            onClick={() => setPaginaAtual(paginaAtual - 1)}
          >
            Anterior
          </button>

          {Array.from({ length: totalPaginas }, (_, index) => (
            <button
              key={index + 1}
              className={paginaAtual === index + 1 ? "pagina-ativa" : ""}
              onClick={() => setPaginaAtual(index + 1)}
            >
              {index + 1}
            </button>
          ))}

          <button
            disabled={paginaAtual === totalPaginas}
            onClick={() => setPaginaAtual(paginaAtual + 1)}
          >
            Próxima
          </button>
        </div>
      )}

      {mensagem && mensagem !== "Erro ao carregar produtos." && (
        <div className="mensagem">{mensagem}</div>
      )}

      {/* MODAL LER NOTA FISCAL */}
      {modalNotaFiscal &&
        createPortal(
          <div
            className="modal-fundo"
            onClick={() => {
              if (textoNotaFiscal || itensNotaFiscal.length > 0) {
                setConfirmarSaidaNF(true);
              } else {
                setModalNotaFiscal(false);
              }
            }}
          >
            <div
              className="modal-caixa modal-caixa-nf"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="nota-fiscal-cabecalho">
                <div className="nota-fiscal-cabecalho-icone">
                  <FileText size={26} aria-hidden="true" />
                </div>
                <div className="nota-fiscal-cabecalho-texto">
                  <h2>Ler Nota Fiscal</h2>
                  <p>Selecione ou arraste o arquivo da nota fiscal para leitura e cadastro dos produtos.</p>
                </div>
                <button
                  type="button"
                  className="nota-fiscal-fechar"
                  aria-label="Fechar leitura da nota fiscal"
                  onClick={() => {
                    if (textoNotaFiscal || itensNotaFiscal.length > 0) {
                      setConfirmarSaidaNF(true);
                    } else {
                      setModalNotaFiscal(false);
                      setArquivoNotaFiscal(null);
                      setTextoNotaFiscal("");
                      setItensNotaFiscal([]);
                    }
                  }}
                >
                  <X size={18} aria-hidden="true" />
                </button>
              </div>

              <div
                className={`nota-fiscal-dropzone${arrastandoArquivo ? " nota-fiscal-dropzone-ativa" : ""}`}
                onDragEnter={(event) => {
                  event.preventDefault();
                  setArrastandoArquivo(true);
                }}
                onDragOver={(event) => {
                  event.preventDefault();
                  setArrastandoArquivo(true);
                }}
                onDragLeave={(event) => {
                  if (!event.currentTarget.contains(event.relatedTarget)) {
                    setArrastandoArquivo(false);
                  }
                }}
                onDrop={receberArquivoNotaFiscal}
              >
                <input
                  id="arquivo-nota-fiscal"
                  type="file"
                  className="nota-fiscal-input-arquivo"
                  accept="image/*,.pdf"
                  onChange={(event) => {
                    selecionarArquivoNotaFiscal(event.target.files?.[0]);
                    event.target.value = "";
                  }}
                />
                <label htmlFor="arquivo-nota-fiscal" className="nota-fiscal-dropzone-conteudo">
                  <span className="nota-fiscal-dropzone-icone">
                    <FileText size={38} aria-hidden="true" />
                    <Upload size={20} aria-hidden="true" />
                  </span>
                  <span className="nota-fiscal-dropzone-titulo">
                    Arraste e solte o arquivo da nota fiscal <strong>aqui</strong>
                  </span>
                  <span className="nota-fiscal-dropzone-ajuda">
                    ou <strong>clique para selecionar</strong> o arquivo
                  </span>
                  {arquivoNotaFiscal && (
                    <span className="nota-fiscal-arquivo-selecionado">
                      {arquivoNotaFiscal.name}
                    </span>
                  )}
                </label>
              </div>

              <p className="nota-fiscal-formatos">Formatos aceitos: PDF, JPG, PNG e outras imagens</p>

              {textoNotaFiscal && (
                <div className="form-group">
                  <label>Texto extraído:</label>
                  <textarea
                    value={textoNotaFiscal}
                    readOnly
                    rows={10}
                    style={{
                      width: "100%",
                      resize: "vertical",
                      padding: "10px",
                      borderRadius: "8px",
                    }}
                  />

                  {itensNotaFiscal.length > 0 && (
                    <div className="form-group">
                      <label>Produtos encontrados:</label>

                      <table>
                        <thead>
                          <tr>
                            <th>Produto</th>
                            <th>Qtd NF</th>
                            <th>Estoque atual</th>
                            <th>Novo estoque</th>
                          </tr>
                        </thead>

                        <tbody>
                          {itensNotaFiscal.map((item) => (
                            <tr key={item.idProduto}>
                              <td>{item.nome}</td>
                              <td>{item.quantidade}</td>
                              <td>{item.estoqueAtual}</td>
                              <td>{item.novoEstoque}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              <div className="modal-botoes">
                <button
                  onClick={() => {
                    if (textoNotaFiscal || itensNotaFiscal.length > 0) {
                      setConfirmarSaidaNF(true);
                    } else {
                      setModalNotaFiscal(false);
                      setArquivoNotaFiscal(null);
                      setTextoNotaFiscal("");
                      setItensNotaFiscal([]);
                    }
                  }}
                >
                  Fechar
                </button>

                <button
                  className="btn-salvar"
                  onClick={lerNotaFiscal}
                  disabled={carregandoNotaFiscal}
                >
                  <FileText size={16} aria-hidden="true" />
                  {carregandoNotaFiscal ? "Lendo..." : "Ler NF"}
                </button>

                {itensNotaFiscal.length > 0 && (
                  <button
                    className="btn-salvar"
                    onClick={confirmarEntradaNotaFiscal}
                  >
                    Confirmar entrada no estoque
                  </button>
                )}
              </div>

              {confirmarSaidaNF && (
                <div className="confirmacao-saida-nf">
                  <div
                    className="confirmacao-caixa"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <h3>Tem certeza que deseja sair sem finalizar?</h3>

                    <div className="confirmacao-botoes">
                      <button
                        className="btn-sim-sair"
                        onClick={() => {
                          setModalNotaFiscal(false);
                          setConfirmarSaidaNF(false);
                          setArquivoNotaFiscal(null);
                          setTextoNotaFiscal("");
                          setItensNotaFiscal([]);
                        }}
                      >
                        Sim
                      </button>

                      <button
                        className="btn-nao-sair"
                        onClick={() => setConfirmarSaidaNF(false)}
                      >
                        Não
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>,
          document.body
        )}

      {/* MODAL EDITAR */}

      {modalEditar &&
        createPortal(
          <div
            className="modal-fundo"
            onClick={() => {
              setModalProdutoOrigem("editar");
              setConfirmarSaidaProduto(true);
            }}
          >
            <div
              className="modal-caixa modal-caixa-scroll"
              onClick={(e) => e.stopPropagation()}
            >
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
                    setFormEditar({
                      ...formEditar,
                      qtdUnidade: e.target.value,
                    })
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
          <div
            className="modal-fundo"
            onClick={() => {
              setModalProdutoOrigem("adicionar");
              setConfirmarSaidaProduto(true);
            }}
          >
            <div
              className="modal-caixa modal-caixa-scroll"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="modal-titulo-novo-produto">
                <img src={iconCaixa} alt="" />
                Novo Produto
              </h3>
              <p>Preencha as informações para cadastrar um novo produto no seu estoque</p>

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
                    setFormAdicionar({
                      ...formAdicionar,
                      preco: e.target.value,
                    })
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

      {/* MODAL ADICIONAR AO ESTOQUE */}
      {modalAdicionarEstoque &&
        createPortal(
          <div className="modal-fundo">
            <div className="modal-caixa modal-caixa-estoque">
              <h3 className="modal-caixa-titulo-estoque">
                <img src={iconCaixa} alt="" />
                Adicionar ao Estoque
              </h3>
              <p>Selecione o produto e informe a quantidade</p>

              <div className="form-group">
                <label>Nome <span>*</span></label>
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
                <label>Quantidade <span> *</span></label>
                <input
                  placeholder="Digite a quantidade"
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
                <button className="btn-cancelar"
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

      {confirmarSaidaProduto &&
        createPortal(
          <div className="confirmacao-saida-nf">
            <div className="confirmacao-caixa">
              <h3>Tem certeza que deseja sair sem finalizar?</h3>

              <div className="confirmacao-botoes">
                <button
                  className="btn-sim-sair"
                  onClick={() => {
                    if (modalProdutoOrigem === "editar") {
                      setModalEditar(false);
                    }

                    if (modalProdutoOrigem === "adicionar") {
                      setModalAdicionar(false);
                    }

                    setConfirmarSaidaProduto(false);
                    setModalProdutoOrigem(null);
                  }}
                >
                  Sim
                </button>

                <button
                  className="btn-nao-sair"
                  onClick={() => {
                    setConfirmarSaidaProduto(false);
                    setModalProdutoOrigem(null);
                  }}
                >
                  Não
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