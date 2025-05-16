//reservations board

import { useEffect, useState } from 'react';
import api from '../api/axios';
import { Container, Grid, Button, Typography } from '@mui/material';

export default function ReservationsBoard() {
  const [reserv, setReserv] = useState([]);
  useEffect(()=>{
    api.get('/reservations').then(r=>setReserv(r.data));
  },[]);
  return (
    <Container sx={{mt:4}}>
      <Typography variant="h5">Reservaciones</Typography>
      <Grid container spacing={1}>
        {reserv.map(r=>(
          <Grid item key={r.reservationId} xs={12}>
            <Typography>{`Reserva ${r.reservationId}: Sala ${r.id_cinema} Asientos ${r.seats}`}</Typography>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
