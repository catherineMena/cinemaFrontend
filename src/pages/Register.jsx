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
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const { user_name, email, pwd } = form;

    if (!user_name || !email || !pwd) return alert('Por favor completa todos los campos.');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return alert('Correo inválido.');

    if (pwd.length < 6) return alert('La contraseña debe tener al menos 6 caracteres.');

    try {
      setLoading(true);

      await api.post('/auth/register', form);

      const loginRes = await api.post('/auth/login', { email, pwd });
      localStorage.setItem('token', loginRes.data.token);

      // Manejo de usuario
      const user = loginRes.data.user || JSON.parse(atob(loginRes.data.token.split('.')[1]));
      localStorage.setItem('user', JSON.stringify(user));

      navigate('/rooms');
    } catch (err) {
      alert(err.response?.data?.error || 'Error al registrar');
    } finally {
      setLoading(false);
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
          disabled={loading}
        />
        <TextField
          fullWidth
          label="Email"
          name="email"
          type="email"
          margin="normal"
          value={form.email}
          onChange={handleChange}
          disabled={loading}
        />
        <TextField
          fullWidth
          label="Contraseña"
          name="pwd"
          type="password"
          margin="normal"
          value={form.pwd}
          onChange={handleChange}
          disabled={loading}
        />
        <Button
          fullWidth
          variant="contained"
          type="submit"
          sx={{ mt: 2 }}
          disabled={loading}
        >
          {loading ? 'Creando cuenta...' : 'Registrarse'}
        </Button>
      </form>
      <Typography variant="body2" sx={{ mt: 2 }}>
        ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
      </Typography>
    </Container>
  );
}
