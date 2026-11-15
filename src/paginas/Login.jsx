import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import logo from '../assets/logo.png';
import './Login.css';
import api, { textoDoErro } from '../services/api';

function LoginPage({ onLogin }) {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [erroMensagem, setErroMensagem] = useState('');

  const handleLogin = async (event) => {
    event.preventDefault();
    setErroMensagem('');

  
    const pacoteLogin = {
      email: email,
      senhaCripto: senha
    };

    try {
      const { data: dados } = await api.post('/funcionarios/login', pacoteLogin);

      if (!dados?.token) {
        setErroMensagem('O servidor não retornou um token de acesso.');
        return;
      }

      localStorage.setItem(
        'tokenAdega',
        dados.token
      )

      localStorage.setItem(
        'idFuncionario',
        dados.id
      )

      localStorage.setItem(
        'nomeUsuario',
        dados.nome
      )

      localStorage.setItem(
        'cargoUsuario',
        dados.cargo
      )

      localStorage.setItem(
        'permissoesUsuario',
        JSON.stringify(dados.permissoes || [])
      )

      onLogin();
      navigate('/produtos', { replace: true });
    } catch (erro) {
      if (erro.response) {
        // Servidor respondeu com status de erro (equivale ao antigo "else" de resposta.ok)
        setErroMensagem(textoDoErro(erro.response.data) || 'E-mail ou senha incorretos!');
      } else {
        setErroMensagem('Erro de conexão com o servidor.');
      }
    }
  };

  return (
    <div className="login-container">
      <div className="bg-glow"></div>

      <div className="login-card">
        <img
          src={logo}
          alt="Adega Underground"
          className="card-logo"
        />
        <div className="branding-section">
          <h1>Adega <span>Underground</span></h1>
          <p>Controle total da sua adega, simples e eficiente.</p>
        </div>

        <div className="form-section">
          <div className="top-line-glow"></div>
          <h2>Entrar</h2>

          <form onSubmit={handleLogin}>
            <div className="input-group">
              <label>E-mail</label>
              <div className="relative-input">
                <Mail className="input-icon" size={20} />
                <input
                  type="email"
                  placeholder="seu@email.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="input-group">
              <label>Senha</label>
              <div className="relative-input">
                <Lock className="input-icon" size={20} />
                <input
                  type={mostrarSenha ? 'text' : 'password'}
                  placeholder="*******"
                  required
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                />
                <button
                  type="button"
                  className="eye-button"
                  aria-label={mostrarSenha ? 'Ocultar senha' : 'Mostrar senha'}
                  aria-pressed={mostrarSenha}
                  onClick={() => setMostrarSenha((visivel) => !visivel)}
                >
                  {mostrarSenha ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {erroMensagem && (
              <p style={{ color: 'red', fontWeight: 'bold', fontSize: '14px', marginTop: '10px' }}>
                {erroMensagem}
              </p>
            )}

            <button type="submit" className="btn-submit">
              Entrar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;