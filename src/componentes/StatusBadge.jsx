function StatusBadge({ status }) {
  return (
    <span className={`status ${status === "Pago" ? "pago" : "aberto"}`}>
      {status}
    </span>
  );
}

export default StatusBadge;