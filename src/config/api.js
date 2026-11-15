// Único ponto do front-end que conhece a URL base do back-end.
// A URL vem da variável de ambiente VITE_API_URL (arquivo .env na raiz do front-end).
// Se ela estiver ausente ou vazia, usa o back-end local.

const PORTA_BACKEND_PADRAO = 8080;
const URL_LOCAL_PADRAO = `http://localhost:${PORTA_BACKEND_PADRAO}`;

const urlDoAmbiente = (import.meta.env.VITE_API_URL ?? "").trim();

// Remove barras finais para evitar URLs como "http://host:8080//produtos".
export const API_BASE_URL = (urlDoAmbiente || URL_LOCAL_PADRAO).replace(/\/+$/, "");

// Tempo máximo (ms) para requisições comuns.
export const API_TIMEOUT_MS = 15000;

// Uploads e processamentos pesados (ex: OCR de nota fiscal) precisam de mais tempo.
export const API_TIMEOUT_UPLOAD_MS = 120000;
