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
  Snackbar,
  Paper,
  Grid
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
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

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
    if (seat.status === 'reserved') {
      showSnackbar('Este asiento ya está reservado', 'error');
      return;
    }

    const seatId = `${seat.seat_row}-${seat.seat_column}`;
    if (selectedSeats.some(s => `${s.seat_row}-${s.seat_column}` === seatId)) {
      setSelectedSeats(prev => prev.filter(s => `${s.seat_row}-${s.seat_column}` !== seatId));
    } else {
      setSelectedSeats(prev => [...prev, seat]);
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
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
          width: 36,
          height: 36,
          m: 0.5,
          bgcolor: isReserved ? '#f44336' : isSelected ? '#4fc3f7' : '#4caf50',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '4px',
          border: '1px solid',
          borderColor: isReserved ? '#d32f2f' : isSelected ? '#0288d1' : '#2e7d32',
          cursor: isReserved ? 'not-allowed' : 'pointer',
          transition: 'all 0.2s ease',
          '&:hover': {
            transform: isReserved ? 'none' : 'scale(1.05)'
          }
        }}
        onClick={() => toggleSeat({ seat_row: row, seat_column: col, full_name: name, status: seat?.status || 'available' })}
      >
        {isReserved ? <CancelIcon fontSize="small" /> : <EventSeatIcon fontSize="small" />}
      </Box>
    );
  };

  const handleReservation = async () => {
    if (selectedSeats.length === 0) {
      showSnackbar('Selecciona al menos un asiento', 'error');
      return;
    }

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

      showSnackbar('Reservación realizada con éxito');
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      console.error(err);
      showSnackbar('Error al confirmar la reservación', 'error');
    }
  };

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!room) return null;

  return (
    <Box sx={{ 
      px: 3, 
      py: 4,
      maxWidth: 1200,
      mx: 'auto'
    }}>
      <Typography variant="h4" gutterBottom sx={{ 
        fontWeight: 'bold',
        color: 'primary.main',
        mb: 3,
        textAlign: 'center'
      }}>
        Selección de Asientos: <span style={{ color: 'text.primary' }}>{room.name}</span>
      </Typography>
      
      <Typography variant="h6" mb={4} sx={{ 
        textAlign: 'center',
        color: 'text.secondary'
      }}>
        {selectedSchedule.date} • {selectedSchedule.time}
      </Typography>

      {/* Pantalla */}
      <Box sx={{
        width: '80%',
        height: 20,
        mx: 'auto',
        mb: 4,
        background: 'linear-gradient(to bottom, #e0e0e0, #9e9e9e)',
        boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
        borderRadius: '4px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#333',
        fontWeight: 'bold',
        fontSize: '0.9rem'
      }}>
        PANTALLA
      </Box>

      {/* Sala de cine */}
      <Paper elevation={3} sx={{
        p: 3,
        mb: 4,
        backgroundColor: 'background.paper',
        borderRadius: 2,
        position: 'relative'
      }}>
        {/* Indicadores de columnas (números) */}
        <Box sx={{
          display: 'flex',
          ml: 7,
          mb: 1
        }}>
          {[...Array(room.columns_num)].map((_, col) => (
            <Box key={`col-${col}`} sx={{
              width: 36,
              mx: 0.5,
              textAlign: 'center',
              fontWeight: 'bold',
              color: 'text.secondary'
            }}>
              {col + 1}
            </Box>
          ))}
        </Box>

        {/* Asientos */}
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          {[...Array(room.rows_num)].map((_, row) => (
            <Box key={row} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              {/* Indicador de fila (letra) */}
              <Box sx={{
                width: 24,
                mr: 2,
                textAlign: 'center',
                fontWeight: 'bold',
                color: 'text.secondary'
              }}>
                {String.fromCharCode(65 + row)}
              </Box>
              
              {/* Fila de asientos */}
              <Box sx={{ display: 'flex' }}>
                {[...Array(room.columns_num)].map((_, col) => renderSeat(row, col))}
              </Box>
            </Box>
          ))}
        </Box>
      </Paper>

      {/* Leyenda */}
      <Grid container spacing={2} justifyContent="center" sx={{ mb: 4 }}>
        <Grid item>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <EventSeatIcon sx={{ color: '#4caf50', mr: 1 }} />
            <Typography variant="body2">Disponible - Asiento libre para seleccionar</Typography>
          </Box>
        </Grid>
        <Grid item>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <EventSeatIcon sx={{ color: '#4fc3f7', mr: 1 }} />
            <Typography variant="body2">Seleccionado - Tus asientos elegidos</Typography>
          </Box>
        </Grid>
        <Grid item>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <CancelIcon sx={{ color: '#f44336', mr: 1 }} />
            <Typography variant="body2">Ocupado - Asiento ya reservado</Typography>
          </Box>
        </Grid>
      </Grid>

      {selectedSeats.length > 0 && (
        <Box sx={{ 
          textAlign: 'center',
          mt: 4,
          mb: 6
        }}>
          <Typography variant="h6" gutterBottom>
            {selectedSeats.length} asiento(s) seleccionado(s): 
            {selectedSeats.map(seat => ` ${String.fromCharCode(65 + seat.seat_row)}${seat.seat_column + 1}`).join(', ')}
          </Typography>
          <Button 
            variant="contained" 
            size="large" 
            onClick={handleReservation}
            sx={{
              px: 6,
              py: 1.5,
              fontSize: '1.1rem',
              fontWeight: 'bold',
              backgroundColor: '#1976d2',
              '&:hover': {
                backgroundColor: '#1565c0'
              }
            }}
          >
            Confirmar Reservación
          </Button>
        </Box>
      )}

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSnackbarOpen(false)} 
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}