// src/pages/SeatSelector.jsx
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';
import {
  Box,
  Button,
  Typography,
  Grid,
  CircularProgress,
  Alert,
} from '@mui/material';
import EventSeatIcon from '@mui/icons-material/EventSeat';
import CancelIcon from '@mui/icons-material/Cancel';

export default function SeatSelector() {
  const { cinemaId } = useParams(); // ID de la sala
  const [room, setRoom] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [seats, setSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar sala y horarios
  useEffect(() => {
    const fetchData = async () => {
      try {
        const roomsRes = await api.get('/rooms');
        const foundRoom = roomsRes.data.find(r => r.id === parseInt(cinemaId));
        if (!foundRoom) return setError('Sala no encontrada');
        setRoom(foundRoom);

        const schedulesRes = await api.get('/schedules');
        const horarios = schedulesRes.data.filter(s => s.id_cinema === parseInt(cinemaId));
        setSchedules(horarios);
      } catch (err) {
        console.error(err);
        setError('Error al cargar la sala o los horarios.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [cinemaId]);

  // Cargar asientos cuando se selecciona un horario
  useEffect(() => {
    if (!selectedSchedule) return;
    setLoading(true);
    api.get(`/seats/${selectedSchedule.id}`)
      .then(res => setSeats(res.data))
      .catch(err => {
        console.error(err);
        setError('Error al cargar los asientos.');
      })
      .finally(() => setLoading(false));
  }, [selectedSchedule]);

  const renderSeat = (row, col) => {
    const name = `${String.fromCharCode(65 + row)}${col + 1}`;
    const seat = seats.find(s => s.full_name === name);
    const isReserved = seat?.status === 'reserved';

    return (
      <Box
        key={name}
        sx={{
          width: 40,
          height: 40,
          m: 0.5,
          bgcolor: isReserved ? '#f44336' : '#4caf50',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 1,
          border: '1px solid #fff',
          cursor: isReserved ? 'not-allowed' : 'pointer',
          transition: '0.3s',
        }}
      >
        {isReserved ? <CancelIcon fontSize="small" /> : <EventSeatIcon fontSize="small" />}
      </Box>
    );
  };

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!room) return null;

  return (
    <Box sx={{ px: 3, py: 4 }}>
      <Typography variant="h5" gutterBottom>
        Selecciona un horario para: {room.name}
      </Typography>

      <Box display="flex" gap={2} flexWrap="wrap" mb={4}>
        {schedules.map(s => (
          <Button
            key={s.id}
            variant="outlined"
            color="primary"
            onClick={() => setSelectedSchedule(s)}
          >
            {s.date} — {s.time}
          </Button>
        ))}
      </Box>

      {selectedSchedule && (
        <>
          <Typography variant="h6" gutterBottom>
            Asientos para horario: {selectedSchedule.time}
          </Typography>
          <Box
            sx={{
              backgroundColor: '#212121',
              borderRadius: 2,
              p: 2,
              color: 'white',
            }}
          >
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
        </>
      )}
    </Box>
  );
}
