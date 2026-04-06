import { useState } from "react";
import "../paginas/Colaboradores.css";

function EmployeesPage() {

  const [animandoSaidaErro, setAnimandoSaidaErro] = useState(false);
  const [animandoSaidaSucesso, setAnimandoSaidaSucesso] = useState(false);

  const [mostrarSucesso, setMostrarSucesso] = useState(false);
  const [erroForm, setErroForm] = useState("");

  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [senha, setSenha] = useState("");

  const [permissoes, setPermissoes] = useState([]);

  const [email, setEmail] = useState("");
  const [erroEmail, setErroEmail] = useState("");

  const todasPermissoes = [
    "usuarios_ver", "usuarios_criar", "usuarios_editar", "usuarios_desativar", "usuarios_reset",
    "produtos_ver", "produtos_criar", "produtos_excluir",
    "estoque_ver", "estoque_entrada", "estoque_ajuste", "estoque_perdas", "estoque_historico",
    "vendas_registrar", "vendas_desconto", "vendas_cancelar", "vendas_historico"
  ];

  const handleCheckbox = (e) => {
    const { value, checked } = e.target;
    if (checked) setPermissoes([...permissoes, value]);
    else setPermissoes(permissoes.filter(p => p !== value));
  };

  const selecionarTudo = () => {
    if (permissoes.length === todasPermissoes.length) setPermissoes([]);
    else setPermissoes(todasPermissoes);
  };

  const perfis = {
    admin: todasPermissoes,
    gerente: [...todasPermissoes],
    atendente: [
      "produtos_ver", "estoque_ver",
      "vendas_registrar", "vendas_desconto", "vendas_historico"
    ]
  };

  const handlePerfil = (e) => {
    const perfil = e.target.value;
    if (!perfil) return setPermissoes([]);
    if (perfis[perfil]) setPermissoes(perfis[perfil]);
  };

  const handleCpf = (e) => {
    let v = e.target.value.replace(/\D/g, '').slice(0, 11);
    v = v.replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    e.target.value = v;
  };

  const handleEmail = (e) => {
    const valor = e.target.value;
    setEmail(valor);
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setErroEmail(!regex.test(valor) ? "E-mail inválido" : "");
  };

  const handleTel = (e) => {
    let nums = e.target.value.replace(/\D/g, '').slice(0, 11);
    let v = '';

    if (nums.length <= 2) v = nums;
    else if (nums.length <= 6) v = `(${nums.slice(0, 2)}) ${nums.slice(2)}`;
    else if (nums.length <= 10) v = `(${nums.slice(0, 2)}) ${nums.slice(2, 6)}-${nums.slice(6)}`;
    else v = `(${nums.slice(0, 2)}) ${nums.slice(2, 7)}-${nums.slice(7)}`;

    e.target.value = v;
  };

  const handleSenha = (e) => setSenha(e.target.value);

  const requisitosSenha = {
    tamanho: senha.length >= 8,
    maiuscula: /[A-Z]/.test(senha),
    numero: /\d/.test(senha),
    especial: /[!@#$%^&*(),.?":{}|<>]/.test(senha)
  };

  const mostrarErro = (mensagem) => {
    setErroForm(mensagem);

    setTimeout(() => {
      setAnimandoSaidaErro(true);

      setTimeout(() => {
        setErroForm("");
        setAnimandoSaidaErro(false);
      }, 1000);
    }, 3000);
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    setErroForm("");

    const form = e.target;
    const nome = form[0].value;
    const sobrenome = form[1].value;
    const cpf = form[2].value;
    const telefone = form[4].value;

    if (!nome || !sobrenome || !cpf || !email || !telefone || !senha) {
      mostrarErro("Preencha todos os campos obrigatórios");
      return;
    }

    if (erroEmail) {
      mostrarErro("Corrija o e-mail antes de continuar");
      return;
    }

    const senhaValida =
      requisitosSenha.tamanho &&
      requisitosSenha.maiuscula &&
      requisitosSenha.numero &&
      requisitosSenha.especial;

    if (!senhaValida) {
      mostrarErro("A senha não atende aos requisitos");
      return;
    }

    if (permissoes.length === 0) {
      mostrarErro("Selecione pelo menos uma permissão");
      return;
    }

    setMostrarSucesso(true);

    setTimeout(() => {
      setAnimandoSaidaSucesso(true);

      setTimeout(() => {
        setMostrarSucesso(false);
        setAnimandoSaidaSucesso(false);
      }, 1000);
    }, 3000);

    setErroForm("");
  };

  return (
    <section className="wrap">

      <div className="head">
        <div className="title">
          <h1>Cadastrar Novo Usuário</h1>
          <p>Crie o acesso de seu colaborador</p>
        </div>
      </div>

      {erroForm && (
        <div className={`alert-erro ${animandoSaidaErro ? "fade-out" : ""}`}>
          {erroForm}
        </div>
      )}

      {mostrarSucesso && (
        <div className={`alert-sucesso ${animandoSaidaSucesso ? "fade-out" : ""}`}>
          ✔ Usuário cadastrado com sucesso!
        </div>
      )}


      <form className="card" onSubmit={handleSubmit}>
        <div className="grid">


          {/* COLUNA 1 */}
          <div className="col">
            <p className="section-title">Dados do Usuário</p>

            <div className="row">
              <div>
                <label>Nome</label>
                <input placeholder="Ex: João" />
              </div>
              <div>
                <label>Sobrenome</label>
                <input placeholder="Ex: Souza" />
              </div>
            </div>

            <div className="row">
              <div>
                <label>CPF</label>
                <input placeholder="000.000.000-00" onChange={handleCpf} />
                <div className="hint">Somente Números</div>
              </div>

              <div>
                <label>E-mail</label>
                <input value={email} onChange={handleEmail} />
                {erroEmail && <div className="hint erro-email">{erroEmail}</div>}
              </div>
            </div>

            <div className="row">
              <div>
                <label>Telefone</label>
                <input onChange={handleTel} />
                <div className="hint">Somente Números</div>
              </div>

              <div className="pwd">
                <label>Senha</label>

                <div className="input-wrapper">
                  <input type={mostrarSenha ? "text" : "password"} value={senha} onChange={handleSenha} />

                  <button
                    type="button"
                    className="toggle-senha"
                    onClick={() => setMostrarSenha(!mostrarSenha)}
                  >
                    {mostrarSenha ? "Ocultar" : "Mostrar"}
                  </button>
                </div>

                {senha && (
                  <ul className="requisitos">
                    <li className={requisitosSenha.tamanho ? "ok" : "erro"}>✔ Mínimo de 8 caracteres</li>
                    <li className={requisitosSenha.maiuscula ? "ok" : "erro"}>✔ Letra maiúscula</li>
                    <li className={requisitosSenha.numero ? "ok" : "erro"}>✔ Um número</li>
                    <li className={requisitosSenha.especial ? "ok" : "erro"}>✔ Caractere especial</li>
                  </ul>
                )}
              </div>
            </div>

            <div className="row one">
              <div>
                <label>Turno</label>
                <select>
                  <option>Selecione</option>
                  <option>Manhã</option>
                  <option>Tarde</option>
                  <option>Noite</option>
                </select>
              </div>
            </div>
          </div>

          {/* COLUNA 2 */}
          <div className="col">
            <p className="section-title">Permissões de Ações</p>

            <div className="perm-top">
              <div className="pill">
                <label>Perfil Rápido</label>
                <select className="quick" onChange={handlePerfil}>
                  <option value="">Selecione</option>
                  <option value="admin">Admin</option>
                  <option value="gerente">Gerente</option>
                  <option value="atendente">Atendente</option>
                </select>
              </div>

              <button type="button" className="btn-link" onClick={selecionarTudo}>
                {permissoes.length === todasPermissoes.length ? "Desmarcar Tudo" : "Selecionar Tudo"}
              </button>
            </div>

            <div className="perm-grid">

              {/* USUÁRIOS */}
              <fieldset>
                <legend>Usuários</legend>

                <label className="check">
                  <input type="checkbox" value="usuarios_ver" checked={permissoes.includes("usuarios_ver")} onChange={handleCheckbox} />
                  <span>Visualizar usuários</span>
                </label>

                <label className="check">
                  <input type="checkbox" value="usuarios_criar" checked={permissoes.includes("usuarios_criar")} onChange={handleCheckbox} />
                  <span>Cadastrar usuários</span>
                </label>

                <label className="check">
                  <input type="checkbox" value="usuarios_editar" checked={permissoes.includes("usuarios_editar")} onChange={handleCheckbox} />
                  <span>Editar usuários</span>
                </label>

                <label className="check">
                  <input type="checkbox" value="usuarios_desativar" checked={permissoes.includes("usuarios_desativar")} onChange={handleCheckbox} />
                  <span>Desativar / ativar usuários</span>
                </label>

                <label className="check">
                  <input type="checkbox" value="usuarios_reset" checked={permissoes.includes("usuarios_reset")} onChange={handleCheckbox} />
                  <span>Redefinir senha</span>
                </label>
              </fieldset>


              {/* PRODUTOS */}
              <fieldset>
                <legend>Produtos</legend>

                <label className="check">
                  <input type="checkbox" value="produtos_ver" checked={permissoes.includes("produtos_ver")} onChange={handleCheckbox} />
                  <span>Visualizar produtos</span>
                </label>

                <label className="check">
                  <input type="checkbox" value="produtos_criar" checked={permissoes.includes("produtos_criar")} onChange={handleCheckbox} />
                  <span>Cadastrar produtos</span>
                </label>

                <label className="check">
                  <input type="checkbox" value="produtos_excluir" checked={permissoes.includes("produtos_excluir")} onChange={handleCheckbox} />
                  <span>Excluir / inativar produtos</span>
                </label>
              </fieldset>


              {/* ESTOQUE */}
              <fieldset>
                <legend>Estoque</legend>

                <label className="check">
                  <input type="checkbox" value="estoque_ver" checked={permissoes.includes("estoque_ver")} onChange={handleCheckbox} />
                  <span>Visualizar estoque</span>
                </label>

                <label className="check">
                  <input type="checkbox" value="estoque_entrada" checked={permissoes.includes("estoque_entrada")} onChange={handleCheckbox} />
                  <span>Entrada / recebimento</span>
                </label>

                <label className="check">
                  <input type="checkbox" value="estoque_ajuste" checked={permissoes.includes("estoque_ajuste")} onChange={handleCheckbox} />
                  <span>Ajuste manual</span>
                </label>

                <label className="check">
                  <input type="checkbox" value="estoque_perdas" checked={permissoes.includes("estoque_perdas")} onChange={handleCheckbox} />
                  <span>Perdas / quebras</span>
                </label>

                <label className="check">
                  <input type="checkbox" value="estoque_historico" checked={permissoes.includes("estoque_historico")} onChange={handleCheckbox} />
                  <span>Histórico de movimentações</span>
                </label>
              </fieldset>


              {/* VENDAS */}
              <fieldset>
                <legend>Vendas</legend>

                <label className="check">
                  <input type="checkbox" value="vendas_registrar" checked={permissoes.includes("vendas_registrar")} onChange={handleCheckbox} />
                  <span>Registrar venda</span>
                </label>

                <label className="check">
                  <input type="checkbox" value="vendas_desconto" checked={permissoes.includes("vendas_desconto")} onChange={handleCheckbox} />
                  <span>Aplicar desconto</span>
                </label>

                <label className="check">
                  <input type="checkbox" value="vendas_cancelar" checked={permissoes.includes("vendas_cancelar")} onChange={handleCheckbox} />
                  <span>Cancelar venda</span>
                </label>

                <label className="check">
                  <input type="checkbox" value="vendas_historico" checked={permissoes.includes("vendas_historico")} onChange={handleCheckbox} />
                  <span>Histórico de vendas</span>
                </label>
              </fieldset>

            </div>
          </div>

        </div>

        <div className="foot">
          <div className="hint">Dados sensíveis protegidos</div>

          <div className="actions">
            <button type="button" className="btn">Cancelar</button>
            <button type="submit" className="btn primary">Salvar usuário</button>
          </div>
        </div>

      </form>
    </section>
  );
}

export default EmployeesPage;