// src/pages/RoomsList.jsx
import { useEffect, useState } from "react";
import api from "../api/axios";
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { Link } from "react-router-dom";
import MovieIcon from "@mui/icons-material/Movie";
import EventSeatIcon from "@mui/icons-material/EventSeat";
import ScheduleIcon from "@mui/icons-material/Schedule";

const movieImages = {
  "Avatar 2": "https://image.tmdb.org/t/p/w500/8YFL5QQVPy3AgrEQxNYVSgiPEbe.jpg",
  "Spiderman 2": "https://image.tmdb.org/t/p/w500/4q2NNj4S5dG2RLF9CpXsej7yXl.jpg",
  "Avengers: Endgame": "https://image.tmdb.org/t/p/w500/ulzhLuWrPK07P1YkdWQLZnQh1JL.jpg",
  "Avatar Requiem": "https://via.placeholder.com/300x180?text=Avatar+Requiem",
  "Película Ejemplo": "https://via.placeholder.com/300x180?text=Película",
};

export default function RoomsList() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  useEffect(() => {
    api
      .get("/rooms")
      .then((r) => {
        setRooms(r.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching rooms:", err);
        setLoading(false);
      });
  }, []);

  const getGridColumns = () => {
    if (isMobile) return 1;
    if (isTablet) return 2;
    return 5;
  };

  return (
    <Box
      sx={{
        backgroundColor: "#f8f9fa",
        minHeight: "100vh",
        width: "100vw",
        maxWidth: "100%",
        py: 3,
        overflowX: "hidden",
        margin: 0,
        padding: 0,
      }}
    >
      <Container
        maxWidth={false}
        disableGutters
        sx={{
          px: { xs: 2, sm: 3, md: 4, lg: 5 },
          mx: 0,
          width: "100%",
          maxWidth: "100%",
        }}
      >
        <Typography variant="h4" fontWeight="bold" mb={3}>
          Salas de Cine
        </Typography>

        <Grid container spacing={2.5}>
          {rooms.map((r) => (
            <Grid item xs={12} sm={6} md={4} lg={12 / getGridColumns()} key={r.id}>
              <Card
                sx={{
                  height: "100%",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                  borderRadius: 2,
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <CardMedia
                  component="img"
                  height="180"
                  image={
                    movieImages[r.movie] ||
                    (r.img?.startsWith("http")
                      ? r.img
                      : "https://via.placeholder.com/300x180?text=Sala+de+Cine")
                  }
                  alt={`Imagen de ${r.name}`}
                />
                <CardContent sx={{ flexGrow: 1, display: "flex", flexDirection: "column", gap: 1 }}>
                  <Typography variant="h6" fontWeight={600}>
                    {r.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <MovieIcon sx={{ fontSize: 18, mr: 0.5 }} />
                    Película: {r.movie}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <EventSeatIcon sx={{ fontSize: 18, mr: 0.5 }} />
                    Asientos: {r.rows_num * r.columns_num} ({r.rows_num} filas × {r.columns_num} columnas)
                  </Typography>

                  <Button
                    component={Link}
                    to={`/schedules/${r.id}`}
                    variant="outlined"
                    size="small"
                    startIcon={<ScheduleIcon />}
                    fullWidth
                  >
                    Ver Horarios
                  </Button>

                  <Button
                    component={Link}
                    to={`/seats/${r.id}`}
                    variant="contained"
                    size="small"
                    startIcon={<EventSeatIcon />}
                    fullWidth
                  >
                    Ver Asientos
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
