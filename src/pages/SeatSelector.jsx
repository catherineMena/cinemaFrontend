// src/pages/SeatSelector.jsx
import { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  Alert,
  Snackbar
} from '@mui/material';
import EventSeatIcon from '@mui/icons-material/EventSeat';
import CancelIcon from '@mui/icons-material/Cancel';

export default function SeatSelector() {
  const { cinemaId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const selectedSchedule = state?.schedule;

  const [room, setRoom] = useState(null);
  const [seats, setSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      if (!selectedSchedule) {
        setError('No se recibió información del horario.');
        setLoading(false);
        return;
      }

      try {
        const roomsRes = await api.get('/rooms');
        const foundRoom = roomsRes.data.find(r => r.id === parseInt(cinemaId));
        if (!foundRoom) return setError('Sala no encontrada');
        setRoom(foundRoom);

        const seatsRes = await api.get(`/seats/${selectedSchedule.id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setSeats(seatsRes.data);
      } catch (err) {
        console.error(err);
        setError('Error al cargar la sala o los asientos.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [cinemaId, selectedSchedule]);

  const toggleSeat = (seat) => {
    if (seat.status === 'reserved') return;

    const seatId = `${seat.seat_row}-${seat.seat_column}`;
    if (selectedSeats.some(s => `${s.seat_row}-${s.seat_column}` === seatId)) {
      setSelectedSeats(prev => prev.filter(s => `${s.seat_row}-${s.seat_column}` !== seatId));
    } else {
      setSelectedSeats(prev => [...prev, seat]);
    }
  };

  const renderSeat = (row, col) => {
    const name = `${String.fromCharCode(65 + row)}${col + 1}`;
    const seat = seats.find(s => s.full_name === name);
    const isReserved = seat?.status === 'reserved';
    const isSelected = selectedSeats.some(s => s.seat_row === row && s.seat_column === col);

    return (
      <Box
        key={name}
        sx={{
          width: 40,
          height: 40,
          m: 0.5,
          bgcolor: isReserved ? '#f44336' : isSelected ? '#2196f3' : '#4caf50',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 1,
          border: '1px solid #fff',
          cursor: isReserved ? 'not-allowed' : 'pointer',
          transition: '0.3s',
        }}
        onClick={() => toggleSeat({ seat_row: row, seat_column: col, full_name: name })}
      >
        {isReserved ? <CancelIcon fontSize="small" /> : <EventSeatIcon fontSize="small" />}
      </Box>
    );
  };

  const handleReservation = async () => {
    try {
      const token = localStorage.getItem('token');
      const decoded = JSON.parse(atob(token.split('.')[1]));
      const user_id = decoded.id;

      await api.post('/reservations', {
        user_id,
        room_id: room.id,
        reservation_date: selectedSchedule.date,
        time: selectedSchedule.time,
        seats: selectedSeats
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setSuccessMessage('Reservación realizada con éxito');
      setSnackbarOpen(true);
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      console.error(err);
      setError('Error al confirmar la reservación.');
    }
  };

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!room) return null;

  return (
    <Box sx={{ px: 3, py: 4 }}>
      <Typography variant="h5" gutterBottom>
        Selecciona tus asientos para: <strong>{room.name}</strong>
      </Typography>
      <Typography variant="subtitle1" mb={2}>
        Fecha: {selectedSchedule.date} — Hora: {selectedSchedule.time}
      </Typography>

      <Box sx={{ backgroundColor: '#212121', borderRadius: 2, p: 2, color: 'white' }}>
        <Typography textAlign="center" mb={2}>
          SCREEN
        </Typography>
        <Box display="flex" flexDirection="column" alignItems="center">
          {[...Array(room.rows_num)].map((_, row) => (
            <Box key={row} display="flex">
              {[...Array(room.columns_num)].map((_, col) => renderSeat(row, col))}
            </Box>
          ))}
        </Box>
      </Box>

      {selectedSeats.length > 0 && (
        <Box mt={4} textAlign="center">
          <Button variant="contained" color="primary" onClick={handleReservation}>
            Confirmar reservación
          </Button>
        </Box>
      )}

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        message={successMessage}
        onClose={() => setSnackbarOpen(false)}
      />
    </Box>
  );
}
