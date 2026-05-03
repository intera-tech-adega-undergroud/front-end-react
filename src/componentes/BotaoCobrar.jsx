import "./BotaoCobrar.css";

function BotaoCobrar({ onClick }) {

  return (
    <button className="btn-cobrar" onClick={onClick}>
      Cobrar
    </button>
  );
}

export default BotaoCobrar;