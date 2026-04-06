import { NavLink, Outlet } from 'react-router-dom'
import iconProduto from "../assets/iconProdutos.svg";
import iconDashboard from "../assets/iconDashboard.svg";
import logo from '../assets/logoChapelAdega.svg';
import iconColaboradores from "../assets/iconColaboradores.svg";
import iconVendaFiada from "../assets/iconVendaFiada.svg"
import avatarPadrao from "../assets/avatarPadrao.svg";
import Header from './Header';
import './NavBar.css'

function SystemLayout({ onLogout, nomeUsuario, cargoUsuario, avatarUsuario }) {
  return (
    <div className="app-layout">
      <aside className="sidebar">
        <h2 className="tituloNav"><img className='logo' src={logo} alt="Logo de chapel de leprechaum" /> Adega Underground</h2>
        <nav className="sidebar-nav">
          <NavLink 
            className={({ isActive }) => isActive ? 'link active' : 'link'} 
            to="/dashboard"
          > 
            <span className="nav-icon">
              <img src={iconDashboard} alt="Ícone de Dashboard" />
            </span>
            Dashboard
          </NavLink>

          <NavLink 
            className={({ isActive }) => isActive ? 'link active' : 'link'} 
            to="/produtos"
          > 
            <span className="nav-icon">
              <img src={iconProduto} alt="Ícone de Produto" />
            </span>
            Produtos
          </NavLink>

          <NavLink 
            className={({ isActive }) => isActive ? 'link active' : 'link'} 
            to="/registrofiado"
          >
            <span className="nav-icon">
              <img src={iconVendaFiada} alt="Ícone de Venda Fiada" />
            </span>
            Registro Fiado
          </NavLink>

          <NavLink 
            className={({ isActive }) => isActive ? 'link active' : 'link'} 
            to="/perdas"
          >
            <span className="nav-icon">
            📉
            </span>
              Perdas
          </NavLink>
          
          <hr />
          
          <NavLink 
            className={({ isActive }) => isActive ? 'link active' : 'link'} 
            to="/colaboradores"
          >
            <span className="nav-icon">
              <img src={iconColaboradores} alt="Ícone de Colaboradores" />
            </span>
            Registro de novo colaborador
          </NavLink>
        </nav>
        <br/>
        <div className='botoes'>
            <button type="button" onClick={onLogout}>
              Sair
            </button>
        </div>
      

      </aside>

      <main className="page-content">
        <Header
          nomeUsuario={nomeUsuario || 'Usuario'}
          cargoUsuario={cargoUsuario || 'Colaborador'}
          avatarSrc={avatarUsuario || avatarPadrao}
        />
        <div className="page-body">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default SystemLayout
