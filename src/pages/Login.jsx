// src/pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import api from '../api/axios';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  TextField,
  Typography,
  Link
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

export default function Login() {
  const [email, setEmail] = useState('');
  const [pwd, setPwd]     = useState('');
  const navigate           = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const { data } = await api.post('/auth/login', { email, pwd });
      localStorage.setItem('token', data.token);
      navigate('/rooms');
    } catch (err) {
      alert(err.response?.data.error || 'Error al iniciar sesión');
    }
  };

  return (
    <Box
         sx={{
          minHeight: '100vh',
          width: '100vw',            // <— ocupar todo el ancho
        backgroundColor: '#f0f2f5',
      display: 'flex',
           alignItems: 'center',
           justifyContent: 'center', // <— centrar horizontalmente
        p: 2
         }}
   >
      <Card sx={{ maxWidth: 400, width: '100%', boxShadow: 3 }}>
        <CardContent>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              mb: 2
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Iniciar Sesión
            </Typography>
          </Box>

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Contraseña"
              type="password"
              value={pwd}
              onChange={e => setPwd(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Entrar
            </Button>

            <Box textAlign="center">
              <Link component={RouterLink} to="/register" variant="body2">
                ¿No tienes cuenta? Regístrate
              </Link>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
