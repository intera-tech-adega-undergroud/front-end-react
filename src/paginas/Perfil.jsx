
import { useState } from 'react';
import '../paginas/Colaboradores.css';

function PerfilPage({ nomeUsuario, cargoUsuario, avatarSrc, onUpdate }) {
  const [nome, setNome] = useState(nomeUsuario || '');
  const [avatar, setAvatar] = useState(avatarSrc || '');
  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setAvatar(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Perfil atualizado! (mock)');
  };

  return (
    <div className="wrap perfil-no-scroll">
      <div className="card" style={{ maxWidth: 900, margin: '48px auto 0 auto' }}>
        <form className="grid" onSubmit={handleSubmit}>
          <div className="col" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minWidth: 220 }}>
            <img src={avatar} alt="Avatar" style={{ width: 120, height: 120, borderRadius: '50%', objectFit: 'cover', border: '3px solid #4ade80', marginBottom: 12 }} />
            <input type="file" accept="image/*" onChange={handleAvatarChange} style={{ marginTop: 10 }} />
          </div>
          <div className="col">
            <div className="section-title">Meu Perfil</div>
            <div className="row one">
              <div style={{ width: '100%' }}>
                <label>Nome</label>
                <input type="text" value={nome} onChange={e => setNome(e.target.value)} />
              </div>
            </div>
            <div className="row one">
              <div style={{ width: '100%' }}>
                <label>Função</label>
                <input type="text" value={cargoUsuario} disabled />
              </div>
            </div>
            <div className="section-title" style={{ marginTop: 24 }}>Alterar senha</div>
            <div className="row">
              <div>
                <label>Senha atual</label>
                <input type="password" placeholder="Senha atual" value={senhaAtual} onChange={e => setSenhaAtual(e.target.value)} />
              </div>
              <div>
                <label>Nova senha</label>
                <input type="password" placeholder="Nova senha" value={novaSenha} onChange={e => setNovaSenha(e.target.value)} />
              </div>
            </div>
            <div className="row one">
              <div style={{ width: '100%' }}>
                <label>Confirmar nova senha</label>
                <input type="password" placeholder="Confirmar nova senha" value={confirmarSenha} onChange={e => setConfirmarSenha(e.target.value)} />
              </div>
            </div>
            <button type="submit" className="btn primary" style={{ marginTop: 24, width: '100%' }}>Salvar alterações</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PerfilPage;
