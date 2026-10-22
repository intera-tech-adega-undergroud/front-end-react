import "./BotaoDashboard.css";

function BotaoCobrar({ onClick, texto = "Produtos", ativo = false }) {

  return (
    <button className={`btn-dashboard${ativo ? " active" : ""}`} onClick={onClick}>
      {texto}
    </button>
  );
}

export default BotaoCobrar;