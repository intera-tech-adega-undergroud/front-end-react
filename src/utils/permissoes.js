export function obterPermissoes() {
  try {
    const salvas = JSON.parse(localStorage.getItem('permissoesUsuario'));
    return Array.isArray(salvas) ? salvas : [];
  } catch {
    return [];
  }
}

export function temPermissao(codigo) {
  return obterPermissoes().includes(codigo);
}
