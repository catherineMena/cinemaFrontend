import { useEffect, useState } from 'react';
import api from '../api/axios';
import { Container, Grid, Card, CardContent, CardMedia, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

export default function RoomsList() {
  const [rooms, setRooms] = useState([]);
  useEffect(()=>{
    api.get('/rooms').then(r=>setRooms(r.data));
  },[]);

  return (
    <Container sx={{mt:4}}>
      <Button component={Link} to="/rooms/new" variant="contained" sx={{mb:2}}>
        Crear Sala
      </Button>
      <Grid container spacing={2}>
        {rooms.map(r=>(
          <Grid item xs={12} sm={6} md={4} key={r.id}>
            <Card>
              <CardMedia component="img" height="140" image={r.img} />
              <CardContent>
                <Typography variant="h6">{r.name}</Typography>
                <Typography>Película: {r.movie}</Typography>
                <Typography>Asientos: {r.rows_num * r.columns_num}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
