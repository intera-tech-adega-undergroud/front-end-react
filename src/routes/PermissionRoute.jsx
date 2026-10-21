import { Navigate, Outlet } from 'react-router-dom'
import { temPermissao } from '../utils/permissoes'

function PermissionRoute({ permissao }) {
  if (!temPermissao(permissao)) {
    return <Navigate to="/dashboard" replace />
  }

  return <Outlet />
}

export default PermissionRoute
