import { useContext } from 'react'
import {
  Navigate
} from 'react-router-dom'
import { AuthContext } from './useAuth'

const ProtectedRoute = ({ children }) => {
  const { user } = useContext(AuthContext)

  if (!user) {
    return <Navigate to="/" replace />
  }

  return children
}

export default ProtectedRoute