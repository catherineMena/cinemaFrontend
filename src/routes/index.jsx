// src/routes/index.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login             from '../pages/Login';
import Register          from '../pages/Register';
import RoomsList         from '../pages/RoomList';
import RoomForm          from '../pages/RoomForm';
import ReservationsBoard from '../pages/ReservationsBoard';
import ProtectedRoute    from './ProtectedRoute';

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"        element={<Login />} />
        <Route path="/login"   element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/rooms"
          element={
            <ProtectedRoute>
              <RoomsList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/rooms/new"
          element={
            <ProtectedRoute>
              <RoomForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reservations"
          element={
            <ProtectedRoute>
              <ReservationsBoard />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
