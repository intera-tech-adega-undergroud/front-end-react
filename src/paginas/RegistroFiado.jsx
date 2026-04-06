import { useState } from "react";
import "./RegistroFiado.css";
import LinhaFiado from "../componentes/LinhaFiado";


function CreditRecordPage() {
  const [status, setStatus] = useState("Em Aberto");
  const [data, setData] = useState("");

  const dados = [
    {
      cliente: "Vinicius Oliveira",
      valor: 130,
      data: "01/03/2026",
      status: "Em Aberto",
    },
    {
      cliente: "Juliana Ribeiro",
      valor: 115,
      data: "02/03/2026",
      status: "Em Aberto",
    },
    {
      cliente: "Alan Souza",
      valor: 61,
      data: "03/03/2026",
      status: "Pago",
    },
    {
      cliente: "Raquel Lima",
      valor: 350,
      data: "20/02/2026",
      status: "Em Aberto",
    },
  ];

  return (
    <>

      <main className="conteudo">
        <h1 className="titulo">Registro Fiado</h1>

        <div className="filtros">

          
          <div className="statusFiado">
            {[ "Todos", "Em Aberto", "Pagos"].map((item) => (
              <button
                key={item}
                className={status === item ? "active" : ""}
                onClick={() => setStatus(item)}
              >
                {item}
              </button>
            ))}
          </div>

          {/* Data */}
          <div className="filtroData">
            <span>Período :</span>
            <p>01/04/2026</p>
            <span>-</span>
            <p>20/04/2027 </p>
            
          </div>

          <div className="valorAberto">
            <p className="totalAberto">Total em Aberto</p>
            <div className="valor">
              <span>R$</span>
              <p>00,00</p>
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
              {dados.map((item, index) => (
                <LinhaFiado key={index} {...item} />
              ))}
            </tbody>
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