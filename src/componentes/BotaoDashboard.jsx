import "./BotaoDashboard.css";

function BotaoCobrar({ onClick, texto = "Produtos" }) {

  return (
    <button className="btn-dashboard" onClick={onClick}>
      {texto}
    </button>
  );
}

export default BotaoCobrar;