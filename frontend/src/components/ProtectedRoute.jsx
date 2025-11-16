import React, { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const ProtectedRoute = ({ children }) => {
  const { token } = useContext(AppContext)

  // Still waiting for token to initialize
  if (token === null) return null

  // Not logged in — redirect to login page
  if (!token) return <Navigate to="/login" replace />

  // ✅ Logged in — render the protected component
  return children
}

export default ProtectedRoute
