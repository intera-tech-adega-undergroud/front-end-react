import { useEffect, useState } from "react";
import "./RegistroFiado.css";
import LinhaFiado from "../componentes/LinhaFiado";

function CreditRecordPage() {
  const [status, setStatus] = useState("Em Aberto");
  const [dados, setDados] = useState([]);
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  

  useEffect(() => {
    carregarClientes();
  }, [dataInicio, dataFim]);

  async function carregarClientes() {
    const token = localStorage.getItem("tokenAdega");

    try {
      let url = "http://localhost:8080/fiados";

      if (dataInicio && dataFim) {
        url += `?dataInicio=${dataInicio}&dataFim=${dataFim}`;
      }

      const resposta = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      });

      if (!resposta.ok) {
        throw new Error("Erro ao buscar clientes");
      }

      const lista = await resposta.json();

      console.log("RETORNO API:", lista);

      setDados(lista);

    } catch (erro) {
      console.log(erro);
    }
  }

  const totalAberto = dados
    .filter(item => item.pago === false)
    .reduce(
      (total, item) => total + item.saldoDevedor,
      0
    );

  const dadosFiltrados = dados.filter(item => {

    if (status === "Todos") {
      return true;
    }

    if (status === "Em Aberto") {
      return item.pago === false;
    }

    if (status === "Pagos") {
      return item.pago === true;
    }

    return true;

  });

  console.log("STATUS:", status);
  console.log("DADOS:", dados.length);
  console.log("FILTRADOS:", dadosFiltrados.length);

  return (
    <>
      <main className="conteudo">
        <h1 className="titulo">Registro Fiado</h1>

        <div className="filtros">

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

          <div className="filtroData">
            <span>Período :</span>

            <input
              type="date"
              value={dataInicio}
              onChange={(e) => setDataInicio(e.target.value)}
            />

            <span>-</span>

            <input
              type="date"
              value={dataFim}
              onChange={(e) => setDataFim(e.target.value)}
            />
          </div>

          <div className="valorAberto">
            <p className="totalAberto">Total em Aberto</p>
            <div className="valor">
              <span>R$</span>
              <p>{totalAberto.toFixed(2)}</p>
            </div>
          </div>

        </div>

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
              {dadosFiltrados.map((item, index) => (
                <LinhaFiado
                  key={`${item.idCliente}-${item.dataVenda}-${index}`}
                  cliente={item.nome}
                  valor={item.saldoDevedor}
                  data={
                    item.dataVenda
                      ? new Date(item.dataVenda).toLocaleDateString("pt-BR")
                      : "-"
                  }
                  status={item.pago ? "Pago" : "Em Aberto"}
                />
              ))}
            </tbody>

            {/*<tbody>
              {dadosFiltrados.map((item) => (
                <LinhaFiado
                  key={item.idCliente}
                  cliente={item.nome}
                  valor={item.saldoDevedor}
                  data={
                    item.dataVenda
                      ? new Date(item.dataVenda).toLocaleDateString("pt-BR")
                      : "-"
                  }
                  status={
                    item.saldoDevedor > 0
                      ? "Em Aberto"
                      : "Pago"
                  }
                />
              ))}
            </tbody> */}

          </table>

          <div className="paginacao">
            <button>{"<"} Anterior</button>

            <div>
              <span className="ativo">1</span>
              <span>2</span>
              <span>3</span>
            </div>

            <button>Próxima {">"}</button>
          </div>
        </div>
      </main>
    </>
  );
}

export default CreditRecordPage;