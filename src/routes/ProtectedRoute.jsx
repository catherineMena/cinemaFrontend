// src/routes/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    // Decodifica el payload del JWT sin librerías externas
    const [, payloadB64] = token.split('.');
    const decoded = JSON.parse(atob(payloadB64));
    // Verifica expiración
    if (Date.now() >= decoded.exp * 1000) {
      localStorage.removeItem('token');
      return <Navigate to="/login" replace />;
    }
    // Si todo OK, renderiza el componente protegido
    return children;
  } catch {
    // Token mal formado o cualquier otro error
    localStorage.removeItem('token');
    return <Navigate to="/login" replace />;
  }
}
