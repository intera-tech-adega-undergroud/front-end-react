import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye } from 'lucide-react';
import logo from '../assets/logo.png';
import './Login.css';

function LoginPage({ onLogin }) {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erroMensagem, setErroMensagem] = useState('');

  const handleLogin = async (event) => {
    event.preventDefault();
    setErroMensagem('');

    const pacoteLogin = {
      email: email,
      senhaCripto: senha
    };

    try {
      const resposta = await fetch('http://localhost:8080/funcionarios/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pacoteLogin)
      });

      if (resposta.ok) {
        const dados = await resposta.json()

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

        onLogin();
        navigate('/produtos', { replace: true });
      } else {
        const textoErro = await resposta.text();
        setErroMensagem(textoErro || 'E-mail ou senha incorretos!');
      }
    } catch (error) {
      setErroMensagem('Erro de conexão com o servidor.');
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
                  type="password"
                  placeholder="*******"
                  required
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                />
                <button type="button" className="eye-button">
                  <Eye size={20} />
                </button>
              </div>
            </div>

            <div className="form-options">
              <label className="remember-me">
                <input type="checkbox" />
                <span>Lembrar de mim</span>
              </label>
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