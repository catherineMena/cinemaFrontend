"use client"

import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import api from "../api/axios"
import { Box, Typography, CircularProgress, Alert, Button, Stack } from "@mui/material"
import EventSeatIcon from "@mui/icons-material/EventSeat"
import CancelIcon from "@mui/icons-material/Cancel"

export default function SeatSelector() {
  const { id } = useParams() // id del horario
  const [room, setRoom] = useState(null)
  const [schedule, setSchedule] = useState(null)
  const [seats, setSeats] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedSeats, setSelectedSeats] = useState([])

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    try {
      const scheduleRes = await api.get("/schedules")
      const currentSchedule = scheduleRes.data.find((s) => s.id === Number.parseInt(id))
      if (!currentSchedule) throw new Error("Horario no encontrado")

      const roomRes = await api.get("/rooms")
      const matchedRoom = roomRes.data.find((r) => r.id === currentSchedule.id_cinema)
      if (!matchedRoom) throw new Error("Sala no encontrada")

      const seatRes = await api.get(`/seats/${id}`)

      setSchedule(currentSchedule)
      setRoom(matchedRoom)
      setSeats(seatRes.data || []) // Asegurarse de que seats sea un array
    } catch (err) {
      console.error("Error fetching data:", err)
      setError("Error al cargar los asientos. Por favor, intenta nuevamente.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (id) fetchData()
  }, [id])

  const handleSeatClick = (name) => {
    const seat = seats.find((s) => s.full_name === name)
    if (seat?.status === "reserved") return

    if (selectedSeats.includes(name)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== name))
    } else {
      setSelectedSeats([...selectedSeats, name])
    }
  }

  const renderSeat = (row, col) => {
    const name = `${String.fromCharCode(65 + row)}${col + 1}`
    const seat = seats.find((s) => s.full_name === name)
    const isReserved = seat?.status === "reserved"
    const isSelected = selectedSeats.includes(name)

    let bgColor = "#81c784" // Disponible
    if (isReserved) bgColor = "#e57373" // Reservado
    if (isSelected) bgColor = "#64b5f6" // Seleccionado

    return (
      <Box
        key={name}
        onClick={() => handleSeatClick(name)}
        sx={{
          width: 40,
          height: 40,
          m: 0.5,
          bgcolor: bgColor,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 1,
          border: "2px solid #fff",
          color: "white",
          cursor: isReserved ? "not-allowed" : "pointer",
          transition: "all 0.2s",
          "&:hover": {
            opacity: isReserved ? 1 : 0.8,
            transform: isReserved ? "none" : "scale(1.05)",
          },
        }}
      >
        {isReserved ? <CancelIcon fontSize="small" /> : <EventSeatIcon fontSize="small" />}
      </Box>
    )
  }

  if (loading) {
    return (
      <Box display="flex" alignItems="center" justifyContent="center" minHeight="100vh" bgcolor="#f5f5f5">
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" bgcolor="#f5f5f5">
        <Alert
          severity="error"
          action={
            <Button color="inherit" size="small" onClick={fetchData}>
              REINTENTAR
            </Button>
          }
          sx={{ width: "100%", maxWidth: 400 }}
        >
          {error}
        </Alert>
      </Box>
    )
  }

  return (
    <Box bgcolor="#ffffff" minHeight="100vh" py={6} px={2}>
      <Box maxWidth="900px" mx="auto" textAlign="center">
        <Typography variant="h4" fontWeight="bold" mb={2}>
          Selección de Asientos
        </Typography>
        <Typography variant="h6" gutterBottom>
          Sala: <strong>{room?.name}</strong> — Horario: <strong>{schedule?.time}</strong>
        </Typography>

        <Box bgcolor="#2c2c2c" borderRadius={3} p={3} mt={4} color="white">
          <Typography variant="body1" gutterBottom>
            PANTALLA
          </Typography>
          <Box display="flex" flexDirection="column" alignItems="center">
            {room &&
              [...Array(room.rows_num)].map((_, row) => (
                <Stack key={row} direction="row">
                  {[...Array(room.columns_num)].map((_, col) => renderSeat(row, col))}
                </Stack>
              ))}
          </Box>
        </Box>

        <Box mt={4} display="flex" justifyContent="center" gap={2}>
          <Box display="flex" alignItems="center">
            <Box sx={{ width: 20, height: 20, bgcolor: "#81c784", borderRadius: 1, mr: 1 }} />
            <Typography variant="body2">Disponible</Typography>
          </Box>
          <Box display="flex" alignItems="center">
            <Box sx={{ width: 20, height: 20, bgcolor: "#64b5f6", borderRadius: 1, mr: 1 }} />
            <Typography variant="body2">Seleccionado</Typography>
          </Box>
          <Box display="flex" alignItems="center">
            <Box sx={{ width: 20, height: 20, bgcolor: "#e57373", borderRadius: 1, mr: 1 }} />
            <Typography variant="body2">Ocupado</Typography>
          </Box>
        </Box>

        {selectedSeats.length > 0 && (
          <Box mt={3}>
            <Typography variant="body1">
              Asientos seleccionados: <strong>{selectedSeats.join(", ")}</strong>
            </Typography>
            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
              onClick={() => alert(`Reservando asientos: ${selectedSeats.join(", ")}`)}
            >
              Reservar Asientos
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  )
}
