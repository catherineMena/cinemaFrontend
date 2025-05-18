// src/pages/ScheduleList.jsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import {
  Container,
  Typography,
  Button,
  Stack
} from '@mui/material';

export default function ScheduleList() {
  const { id } = useParams(); // ID de la sala
  const [schedules, setSchedules] = useState([]);
  const [room, setRoom] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/rooms').then(res => {
      const sala = res.data.find(r => r.id === parseInt(id));
      setRoom(sala);
    });

    api.get('/schedules').then(res => {
      const filtrados = res.data.filter(s => s.id_cinema === parseInt(id));
      setSchedules(filtrados);
    });
  }, [id]);

  const handleSelect = (schedule) => {
    // Redirige a /seats/scheduleId y pasa todo el objeto schedule
    navigate(`/seats/${schedule.id}`, { state: { schedule } });
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Horarios disponibles para: <strong>{room?.name || 'Sala'}</strong>
      </Typography>

      {schedules.length === 0 ? (
        <Typography color="text.secondary">No hay horarios disponibles.</Typography>
      ) : (
        <Stack spacing={2} sx={{ mt: 3 }}>
          {schedules.map(s => (
            <Button
              key={s.id}
              variant="outlined"
              fullWidth
              onClick={() => handleSelect(s)}
            >
              {s.date} — {s.time}
            </Button>
          ))}
        </Stack>
      )}
    </Container>
  );
}
