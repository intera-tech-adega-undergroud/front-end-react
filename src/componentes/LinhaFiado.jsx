import StatusBadge from "./StatusBadge";
import BotaoCobrar from "./BotaoCobrar";

function LinhaFiado({ cliente, valor, data, status, onCobrar }) {
  return (
    <tr>
      <td>{cliente}</td>
      <td>R${valor.toFixed(2)}</td>
      <td>{data}</td>
      <td>
        <StatusBadge status={status} />
      </td>
      <td>
        {status === "Em Aberto" ? <BotaoCobrar onClick={onCobrar} /> : "-"}
      </td>
    </tr>
  );
}

export default LinhaFiado;