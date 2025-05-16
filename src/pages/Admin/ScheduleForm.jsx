// src/pages/ScheduleForm.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from "../../api/axios";
import {
  Container, Typography, TextField, MenuItem, Button, Box
} from '@mui/material';

export default function ScheduleForm() {
  const [form, setForm] = useState({ id_cinema: '', date: '', time: '' });
  const [rooms, setRooms] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/rooms').then(res => setRooms(res.data));
  }, []);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await api.post('/schedules', form);
      alert('Horario agregado correctamente');
      navigate('/rooms');
    } catch (err) {
      alert(err.response?.data?.error || 'Error al crear horario');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>Agregar Horario</Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          select
          fullWidth
          label="Sala"
          name="id_cinema"
          value={form.id_cinema}
          onChange={handleChange}
          margin="normal"
          required
        >
          {rooms.map(room => (
            <MenuItem key={room.id} value={room.id}>
              {room.name} - {room.movie}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          label="Fecha"
          type="date"
          name="date"
          fullWidth
          margin="normal"
          value={form.date}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
          required
        />

        <TextField
          label="Hora"
          type="time"
          name="time"
          fullWidth
          margin="normal"
          value={form.time}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
          required
        />

        <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
          Guardar
        </Button>
      </Box>
    </Container>
  );
}
