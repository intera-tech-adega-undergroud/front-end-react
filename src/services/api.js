import axios from "axios";
import { API_BASE_URL, API_TIMEOUT_MS } from "../config/api";

// Instância única do Axios usada por todo o front-end.
// Use sempre caminhos relativos: api.get("/produtos"), api.post("/fiados/pagamento", corpo)...
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT_MS,
});

// Converte o corpo de uma resposta de erro em texto, equivalente ao antigo `await resposta.text()`.
// O Axios já faz o parse de JSON, então objetos são serializados de volta para string.
export function textoDoErro(data) {
  if (data === undefined || data === null) return "";
  return typeof data === "string" ? data : JSON.stringify(data);
}

export { API_TIMEOUT_UPLOAD_MS } from "../config/api";

export default api;
