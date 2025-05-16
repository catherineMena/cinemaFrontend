// Register.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import {
  Container,
  TextField,
  Button,
  Typography
} from '@mui/material';

export default function Register() {
  const [form, setForm] = useState({
    user_name: '',
    email: '',
    pwd: ''
  });
  const navigate = useNavigate();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await api.post('/auth/register', form);
      alert('Usuario registrado con éxito');
      navigate('/login');
    } catch (err) {
      alert(err.response?.data.error || 'Error al registrar');
    }
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 8 }}>
      <Typography variant="h5" gutterBottom>
        Crear Cuenta
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Nombre de usuario"
          name="user_name"
          margin="normal"
          value={form.user_name}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          label="Email"
          name="email"
          type="email"
          margin="normal"
          value={form.email}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          label="Contraseña"
          name="pwd"
          type="password"
          margin="normal"
          value={form.pwd}
          onChange={handleChange}
        />
        <Button
          fullWidth
          variant="contained"
          type="submit"
          sx={{ mt: 2 }}
        >
          Registrarse
        </Button>
      </form>
      <Typography variant="body2" sx={{ mt: 2 }}>
        ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
      </Typography>
    </Container>
  );
}
