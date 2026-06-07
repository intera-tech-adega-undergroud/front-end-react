import StatusBadge from "./StatusBadge";
import BotaoCobrar from "./BotaoCobrar";

function LinhaFiado({ cliente, valor, data, status, onCobrar }) {
  const valorFormatado = Number(valor || 0).toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const estaPago =
    status !== "Em Aberto" || Number(valor || 0) <= 0;

  return (
    <tr>
      <td>{cliente}</td>
      <td>R$ {valorFormatado}</td>
      <td>{data}</td>
      <td>
        <StatusBadge status={estaPago ? "Pago" : status} />
      </td>
      <td>
        {!estaPago ? (
          <BotaoCobrar onClick={onCobrar} />
        ) : (
          "Pago"
        )}
      </td>
    </tr>
  );
}

export default LinhaFiado;