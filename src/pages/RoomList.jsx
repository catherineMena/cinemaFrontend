"use client"

import { useEffect, useState } from "react"
import api from "../api/axios"
import { Container, Grid, Card, CardContent, CardMedia, Typography, Button, Box } from "@mui/material"
import { Link } from "react-router-dom"

const movieImages = {
  "Avatar 2": "https://image.tmdb.org/t/p/w500/8YFL5QQVPy3AgrEQxNYVSgiPEbe.jpg",
  "Spiderman 2": "https://image.tmdb.org/t/p/w500/4q2NNj4S5dG2RLF9CpXsej7yXl.jpg",
  "Avengers: Endgame": "https://image.tmdb.org/t/p/w500/ulzhLuWrPK07P1YkdWQLZnQh1JL.jpg",
  "Avatar Requiem": "https://via.placeholder.com/300x180?text=Avatar+Requiem",
  "Película Ejemplo": "https://via.placeholder.com/300x180?text=Película",
}

export default function RoomsList() {
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api
      .get("/rooms")
      .then((r) => {
        setRooms(r.data)
        setLoading(false)
      })
      .catch((err) => {
        console.error("Error fetching rooms:", err)
        setLoading(false)
      })
  }, [])

  return (
    <Box
      sx={{
        backgroundColor: "#f4f6f8",
        minHeight: "100vh",
        py: 5,
        px: 2,
        overflowX: "hidden",
      }}
    >
      <Container maxWidth="xl">
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={5}>
          <Typography variant="h4" fontWeight="bold" color="text.primary">
            Salas de Cine
          </Typography>
          <Button
            component={Link}
            to="/rooms/new"
            variant="contained"
            sx={{
              fontWeight: "bold",
              px: 3,
              borderRadius: 2,
              boxShadow: 2,
              backgroundColor: "#1976d2",
              "&:hover": { backgroundColor: "#1565c0" },
            }}
          >
            Crear Sala
          </Button>
        </Box>

        <Grid container spacing={4}>
          {loading
            ? Array.from({ length: 4 }).map((_, index) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={`skeleton-${index}`}>
                  <Card
                    sx={{
                      height: "100%",
                      borderRadius: 3,
                      boxShadow: 2,
                      display: "flex",
                      flexDirection: "column",
                      bgcolor: "grey.100",
                    }}
                  >
                    <Box sx={{ height: 180, bgcolor: "grey.300" }} />
                    <CardContent>
                      <Box sx={{ height: 20, bgcolor: "grey.300", mb: 1, borderRadius: 1 }} />
                      <Box sx={{ height: 20, bgcolor: "grey.300", mb: 1, borderRadius: 1 }} />
                      <Box sx={{ height: 20, bgcolor: "grey.300", borderRadius: 1 }} />
                    </CardContent>
                  </Card>
                </Grid>
              ))
            : rooms.map((r) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={r.id}>
                  <Card
                    sx={{
                      height: "100%",
                      borderRadius: 3,
                      boxShadow: 3,
                      display: "flex",
                      flexDirection: "column",
                      transition: "transform 0.3s, box-shadow 0.3s",
                      "&:hover": {
                        transform: "translateY(-6px)",
                        boxShadow: 5,
                      },
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="180"
                      image={
                        movieImages[r.movie] ||
                        (r.img?.startsWith("http") ? r.img : "https://via.placeholder.com/300x180?text=Sala+de+Cine")
                      }
                      alt={`Imagen de ${r.name}`}
                      sx={{ objectFit: "cover" }}
                    />

                    <CardContent sx={{ flexGrow: 1, p: 2, display: "flex", flexDirection: "column", gap: 1.5 }}>
                      <Typography variant="h6" fontWeight={600}>
                        {r.name}
                      </Typography>

                      <Typography variant="body2" color="text.secondary" sx={{ display: "flex", alignItems: "start" }}>
                        <Box mr={1}>🎬</Box>
                        <Box>
                          <Box component="span" fontWeight="bold">
                            Película:
                          </Box>{" "}
                          {r.movie}
                        </Box>
                      </Typography>

                      <Typography variant="body2" color="text.secondary" sx={{ display: "flex", alignItems: "start" }}>
                        <Box mr={1}>🪑</Box>
                        <Box>
                          <Box component="span" fontWeight="bold">
                            Asientos:
                          </Box>{" "}
                          {r.rows_num * r.columns_num}{" "}
                          <Typography variant="caption" color="text.secondary" component="span">
                            ({r.rows_num} filas × {r.columns_num} columnas)
                          </Typography>
                        </Box>
                      </Typography>

                      <Box mt="auto">
                        <Button
                          component={Link}
                          to={`/schedules/${r.id}`}
                          variant="outlined"
                          size="small"
                          fullWidth
                          sx={{
                            mt: 1,
                            borderRadius: 2,
                            fontWeight: "bold",
                            borderColor: "#1976d2",
                            color: "#1976d2",
                            "&:hover": {
                              backgroundColor: "#e3f2fd",
                              borderColor: "#1565c0",
                            },
                          }}
                        >
                          Ver Horarios
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
        </Grid>
      </Container>
    </Box>
  )
}
