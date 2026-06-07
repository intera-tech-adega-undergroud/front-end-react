import { useEffect, useState } from "react";
import "./RegistroFiado.css";
import LinhaFiado from "../componentes/LinhaFiado";

function CreditRecordPage() {
  const [status, setStatus] = useState("Todos");
  const [mostrarModalCliente, setMostrarModalCliente] = useState(false);
  const [novoCliente, setNovoCliente] = useState({ nome: "", telefone: "" });

  const [dados, setDados] = useState([]);
  const [mensagem, setMensagem] = useState("");
  const [carregando, setCarregando] = useState(false);

  const [cobrarModalAberto, setCobrarModalAberto] = useState(false);
  const [registroSelecionado, setRegistroSelecionado] = useState(null);
  const [valorPagamento, setValorPagamento] = useState("");
  const [formaPagamento, setFormaPagamento] = useState("Dinheiro");
  const [erroPagamento, setErroPagamento] = useState("");

  const API_URL = "http://localhost:8080";

  const buscarFiados = async () => {
    try {
      setCarregando(true);
      setMensagem("");

      const token = localStorage.getItem("tokenAdega");

      const resposta = await fetch("http://localhost:8080/fiados", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!resposta.ok) {
        throw new Error("Erro ao buscar fiados");
      }

      const resultado = await resposta.json();

      console.log("FIADOS DO BACKEND:", resultado);

      setDados(resultado);

    } catch (erro) {
      console.error("ERRO AO BUSCAR FIADOS:", erro);
      setMensagem("Erro ao carregar registros de fiado.");
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    buscarFiados();
  }, []);

  const abrirModalCobrar = (item) => {
    setRegistroSelecionado(item);
    setValorPagamento("");
    setFormaPagamento("Dinheiro");
    setErroPagamento("");
    setCobrarModalAberto(true);
  };

  const fecharModalCobrar = () => {
    setCobrarModalAberto(false);
    setRegistroSelecionado(null);
    setErroPagamento("");
  };

  const confirmarPagamento = async () => {
    if (!registroSelecionado) return;

    const valorNum = parseFloat(valorPagamento.toString().replace(",", "."));

    if (isNaN(valorNum) || valorNum <= 0) {
      setErroPagamento("Informe um valor válido para pagamento");
      return;
    }

    if (valorNum > registroSelecionado.valor) {
      setErroPagamento("O valor de pagamento não pode ser maior que a dívida");
      return;
    }

    try {
      const token = localStorage.getItem("tokenAdega");

      const resposta = await fetch(`${API_URL}/fiados/pagamento`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          idCliente: registroSelecionado.idCliente,
          valorPagamento: valorNum,
          formaPagamento: formaPagamento,
        }),
      });

      if (!resposta.ok) {
        throw new Error("Erro ao registrar pagamento");
      }


      fecharModalCobrar();
    } catch (erro) {
      console.error("ERRO AO PAGAR FIADO:", erro);
      setErroPagamento("Erro ao registrar pagamento.");
    }
  };

  const salvarCliente = async () => {
    if (!novoCliente.nome.trim()) {
      setMensagem("Informe o nome do cliente.");
      return;
    }

    try {
      const token = localStorage.getItem("tokenAdega");

      const resposta = await fetch(`${API_URL}/clientes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",

        },
        body: JSON.stringify(novoCliente),
      });

      if (!resposta.ok) {
        throw new Error("Erro ao cadastrar cliente");
      }

      setNovoCliente({ nome: "", telefone: "" });
      setMostrarModalCliente(false);
      buscarFiados();
    } catch (erro) {
      console.error("ERRO AO CADASTRAR CLIENTE:", erro);
      setMensagem("Erro ao cadastrar cliente.");
    }
  };

  const calcularTotalAberto = () => {
    return dados
      .filter((item) => item.status === "Em Aberto")
      .reduce((total, item) => total + Number(item.valor || 0), 0);
  };

  const totalAberto = calcularTotalAberto();

  const formatarValor = (valor) => {
    return Number(valor || 0).toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const normalizarStatus = (status) => {
    return String(status || "")
      .trim()
      .toLowerCase();
  };

  const dadosFiltrados = dados.filter((item) => {
    const statusItem = normalizarStatus(item.status);

    if (status === "Todos") return true;

    if (status === "Em Aberto") {
      return statusItem === "em aberto" || Number(item.valor) > 0;
    }

    if (status === "Pagos") {
      return (
        statusItem === "pago" ||
        statusItem === "quitado" ||
        Number(item.valor) <= 0
      );
    }

    return true;
  });

  return (
    <>
      <main className="conteudo">
        <h1 className="titulo">Registro Fiado</h1>

        {mensagem && <p className="erro-pagamento">{mensagem}</p>}

        <div className="filtros">
          <div className="cadastroCliente">
            <button
              className="btn-cadastrar-cliente"
              onClick={() => setMostrarModalCliente(true)}
            >
              Cadastrar Cliente Fiado
            </button>
          </div>

          <div className="statusFiado">
            {["Todos", "Em Aberto", "Pagos"].map((item) => (
              <button
                key={item}
                className={status === item ? "active" : ""}
                onClick={() => setStatus(item)}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="valorAberto">
            <p className="totalAberto">Total em Aberto</p>
            <div className="valor">
              <span>R$</span>
              <p>{formatarValor(totalAberto)}</p>
            </div>
          </div>
        </div>

        {mostrarModalCliente && (
          <div
            className="modal-overlay"
            onClick={() => setMostrarModalCliente(false)}
          >
            <div className="modal-box" onClick={(e) => e.stopPropagation()}>
              <h2>Cadastrar Cliente Fiado</h2>

              <div className="modal-input-group">
                <label>Nome cliente</label>
                <input
                  type="text"
                  value={novoCliente.nome}
                  onChange={(e) =>
                    setNovoCliente({ ...novoCliente, nome: e.target.value })
                  }
                  placeholder="Nome do cliente"
                />
              </div>

              <div className="modal-input-group">
                <label>Telefone</label>
                <input
                  type="text"
                  value={novoCliente.telefone}
                  onChange={(e) =>
                    setNovoCliente({
                      ...novoCliente,
                      telefone: e.target.value,
                    })
                  }
                  placeholder="(00) 00000-0000"
                />
              </div>

              <div className="modal-actions">
                <button className="btn-salvar" onClick={salvarCliente}>
                  Salvar
                </button>

                <button
                  className="btn-cancelar"
                  onClick={() => setMostrarModalCliente(false)}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}

        {cobrarModalAberto && registroSelecionado && (
          <div className="modal-overlay" onClick={fecharModalCobrar}>
            <div className="modal-box" onClick={(e) => e.stopPropagation()}>
              <div className="cobrar-modal-header">
                <h2>Cobrar Fiado</h2>

                <button className="btn-cancelar" onClick={fecharModalCobrar}>
                  Cancelar
                </button>
              </div>

              <div className="modal-info">
                <p>
                  <strong>Cliente:</strong> {registroSelecionado.cliente}
                </p>

                <p>
                  <strong>Total da dívida:</strong> R${" "}
                  {formatarValor(registroSelecionado.valor)}
                </p>
              </div>

              {registroSelecionado.compras &&
                registroSelecionado.compras.length > 0 && (
                  <div className="cobrar-modal-list">
                    <h3>Compras</h3>

                    <ul>
                      {registroSelecionado.compras.map((compra, index) => (
                        <li key={index}>
                          <span>{compra.descricao}</span>
                          <span>R$ {formatarValor(compra.valor)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

              <div className="cobrar-modal-form">
                <div className="modal-input-group">
                  <label>Valor que ele vai pagar agora</label>

                  <input
                    type="text"
                    value={valorPagamento}
                    onChange={(e) => setValorPagamento(e.target.value)}
                    placeholder="0,00"
                  />
                </div>

                <div className="modal-input-group">
                  <label>Forma de pagamento</label>

                  <select
                    value={formaPagamento}
                    onChange={(e) => setFormaPagamento(e.target.value)}
                  >
                    <option value="Dinheiro">Dinheiro</option>
                    <option value="Pix">Pix</option>
                    <option value="Cartão de Crédito">
                      Cartão de Crédito
                    </option>
                    <option value="Cartão de Débito">
                      Cartão de Débito
                    </option>
                  </select>
                </div>

                {erroPagamento && (
                  <p className="erro-pagamento">{erroPagamento}</p>
                )}
              </div>

              <div className="modal-actions">
                <button className="btn-salvar" onClick={confirmarPagamento}>
                  Confirmar pagamento
                </button>

                <button className="btn-cancelar" onClick={fecharModalCobrar}>
                  Fechar
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="tabela-container">
          <table>
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Valor Total</th>
                <th>Data Venda</th>
                <th>Status</th>
                <th>Cobrar</th>
              </tr>
            </thead>

            <tbody>
              {carregando ? (
                <tr>
                  <td colSpan="5">Carregando fiados...</td>
                </tr>
              ) : dadosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan="5">Nenhum registro encontrado.</td>
                </tr>
              ) : (
                dadosFiltrados.map((item, index) => (
                  <LinhaFiado
                    key={item.idCliente || index}
                    {...item}
                    onCobrar={() => abrirModalCobrar(item)}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </>
  );
}

export default CreditRecordPage;