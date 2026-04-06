import { useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import LoginPage from './paginas/Login'
import EmployeesPage from './paginas/Colaboradores'
import ProductsPage from './paginas/Produtos'
import CreditRecordPage from './paginas/RegistroFiado'
import DashboardPage from './paginas/Dashboard'
import PerdasPage from './paginas/Perdas'
import SystemLayout from './componentes/NavBar'
import ProtectedRoute from './routes/ProtectedRoute'
import avatarPadrao from './assets/avatarPadrao.svg'
import Header from './componentes/Header'

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
            <Route path="/produtos" element={<ProductsPage />} />
            <Route path="/perdas" element={<PerdasPage />} />
            <Route path="/colaboradores" element={<EmployeesPage />} />
            <Route path="/registrofiado" element={<CreditRecordPage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}

export default App