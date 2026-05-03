import { useState } from "react";
import "./RegistroFiado.css";
import LinhaFiado from "../componentes/LinhaFiado";


function CreditRecordPage() {
  const [status, setStatus] = useState("Todos");
  const [mostrarModalCliente, setMostrarModalCliente] = useState(false);
  const [novoCliente, setNovoCliente] = useState({ nome: "", telefone: "" });

  const [dados, setDados] = useState([
    {
      cliente: "Vinicius Oliveira",
      valor: 130,
      data: "01/03/2026",
      status: "Em Aberto",
      compras: [
        { descricao: "Vinho tinto", valor: 80 },
        { descricao: "Azeitonas", valor: 50 },
      ],
    },
    {
      cliente: "Juliana Ribeiro",
      valor: 115,
      data: "02/03/2026",
      status: "Em Aberto",
      compras: [
        { descricao: "Espumante", valor: 70 },
        { descricao: "Tábua de frios", valor: 45 },
      ],
    },
    {
      cliente: "Alan Souza",
      valor: 61,
      data: "03/03/2026",
      status: "Pago",
      compras: [
        { descricao: "Whisky", valor: 61 },
      ],
    },
    {
      cliente: "Raquel Lima",
      valor: 350,
      data: "20/02/2026",
      status: "Em Aberto",
      compras: [
        { descricao: "Conhaque", valor: 190 },
        { descricao: "Cervejas artesanais", valor: 160 },
      ],
    },
  ]);

  const [cobrarModalAberto, setCobrarModalAberto] = useState(false);
  const [registroSelecionado, setRegistroSelecionado] = useState(null);
  const [valorPagamento, setValorPagamento] = useState("");
  const [formaPagamento, setFormaPagamento] = useState("Dinheiro");
  const [erroPagamento, setErroPagamento] = useState("");

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

  const confirmarPagamento = () => {
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

    const novosDados = dados.map((item) => {
      if (item.cliente === registroSelecionado.cliente && item.data === registroSelecionado.data) {
        const valorRestante = Number((item.valor - valorNum).toFixed(2));
        return {
          ...item,
          valor: valorRestante,
          status: valorRestante <= 0 ? "Pago" : "Em Aberto",
        };
      }
      return item;
    });

    setDados(novosDados);
    fecharModalCobrar();
  };

  // Calcula o total de valores em aberto
  const calcularTotalAberto = () => {
    return dados
      .filter((item) => item.status === "Em Aberto")
      .reduce((total, item) => total + item.valor, 0);
  };

  const totalAberto = calcularTotalAberto();

  // Formata o valor em reais
  const formatarValor = (valor) => {
    return valor.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  return (
    <>

      <main className="conteudo">
        <h1 className="titulo">Registro Fiado</h1>

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
          <div className="modal-overlay" onClick={() => setMostrarModalCliente(false)}>
            <div className="modal-box" onClick={(e) => e.stopPropagation()}>
              <h2>Cadastrar Cliente Fiado</h2>

              <div className="modal-input-group">
                <label>Nome cliente</label>
                <input
                  type="text"
                  value={novoCliente.nome}
                  onChange={(e) => setNovoCliente({ ...novoCliente, nome: e.target.value })}
                  placeholder="Nome do cliente"
                />
              </div>

              <div className="modal-input-group">
                <label>Telefone</label>
                <input
                  type="text"
                  value={novoCliente.telefone}
                  onChange={(e) => setNovoCliente({ ...novoCliente, telefone: e.target.value })}
                  placeholder="(00) 00000-0000"
                />
              </div>

              <div className="modal-actions">
                <button className="btn-salvar" onClick={() => setMostrarModalCliente(false)}>
                  Salvar
                </button>
                <button className="btn-cancelar" onClick={() => setMostrarModalCliente(false)}>
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
                  <strong>Total da dívida:</strong> R$ {formatarValor(registroSelecionado.valor)}
                </p>
              </div>

              {registroSelecionado.compras && registroSelecionado.compras.length > 0 && (
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
                    <option>Dinheiro</option>
                    <option>Pix</option>
                    <option>Cartão</option>
                  </select>
                </div>

                {erroPagamento && <p className="erro-pagamento">{erroPagamento}</p>}
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
              {dados
                .filter((item) => {
                  if (status === "Todos") return true;
                  if (status === "Em Aberto") return item.status === "Em Aberto";
                  if (status === "Pagos") return item.status === "Pago";
                  return true;
                })
                .map((item, index) => (
                  <LinhaFiado key={index} {...item} onCobrar={() => abrirModalCobrar(item)} />
                ))}
            </tbody>
          </table>

          
        </div>
      </main>
    </>
  );
}

export default CreditRecordPage;