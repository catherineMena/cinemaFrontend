import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// en src/pages/RoomForm.jsx, Login.jsx, Register.jsx, etc.
import api from '../api/axios';
import { Container, TextField, Button, Typography } from '@mui/material';

export default function RoomForm() {
  const [form, setForm] = useState({ name:'',rows_num:'',columns_num:'',movie:'',img:''});
  const nav = useNavigate();

  const handle = e => setForm({...form,[e.target.name]:e.target.value});
  const submit = async e => {
    e.preventDefault();
    try {
      await api.post('/rooms', form);
      nav('/');
    } catch (err) {
      alert(err.response?.data.error);
    }
  };

  return (
    <Container maxWidth="sm" sx={{mt:4}}>
      <Typography variant="h5">Crear Sala</Typography>
      <form onSubmit={submit}>
        {['name','rows_num','columns_num','movie','img'].map(f=>(
          <TextField
            key={f}
            fullWidth
            name={f}
            label={f.replace('_',' ')}
            margin="normal"
            value={form[f]}
            onChange={handle}
          />
        ))}
        <Button fullWidth type="submit" variant="contained" sx={{mt:2}}>
          Guardar
        </Button>
      </form>
    </Container>
  );
}
