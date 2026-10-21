import { useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import LoginPage from './paginas/Login'
import EmployeesPage from './paginas/Colaboradores'
import ProductsPage from './paginas/Produtos'
import PerfilPage from './paginas/Perfil'
import CreditRecordPage from './paginas/RegistroFiado'
import DashboardPage from './paginas/Dashboard'
import PerdasPage from './paginas/Perdas'
import SystemLayout from './componentes/NavBar'
import ProtectedRoute from './routes/ProtectedRoute'
import PermissionRoute from './routes/PermissionRoute'
import avatarPadrao from './assets/avatarPadrao.svg'
import Header from './componentes/Header'
import VendasPage from './paginas/Vendas'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true)
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
  }

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <LoginPage onLogin={handleLogin} />
            )
          }
        />

        <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} />}>
          <Route
            element={
              <SystemLayout
                onLogout={handleLogout}
                nomeUsuario="Junior"
                cargoUsuario="Gerente"
                avatarUsuario={avatarPadrao}
              />
            }
          >
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route element={<PermissionRoute permissao="produtos_ver" />}>
              <Route path="/produtos" element={<ProductsPage />} />
            </Route>
            <Route path="/perdas" element={<PerdasPage />} />
            <Route element={<PermissionRoute permissao="usuarios_criar" />}>
              <Route path="/colaboradores" element={<EmployeesPage />} />
            </Route>
            <Route path="/registrofiado" element={<CreditRecordPage />} />
            <Route element={<PermissionRoute permissao="vendas_registrar" />}>
              <Route path="/vendas" element={<VendasPage />} />
            </Route>
            <Route path="/perfil" element={<PerfilPage nomeUsuario="Junior" cargoUsuario="Gerente" avatarSrc={avatarPadrao} />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}

export default App