import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, query, orderBy, limit, onSnapshot, getDocs } from 'firebase/firestore';
import ResponsiveAppBar from '../components/ResponsiveAppBar';
import { styled } from '@mui/material/styles';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Container, Typography, Box, Grid } from '@mui/material';
import Alert from '@mui/material/Alert';

const firebaseConfig = {
  apiKey: "AIzaSyAld7h21LTJtIn8doNLYsRWznaoF0gWzfo",
  authDomain: "biosafe2-90221.firebaseapp.com",
  projectId: "biosafe2-90221",
  storageBucket: "biosafe2-90221.appspot.com",
  messagingSenderId: "502286797810",
  appId: "1:502286797810:web:a7fab35ea050ca428e396b"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${TableCell.head}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
  },
  [`&.${TableCell.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const Temperature = () => {
  const [currentTemp, setCurrentTemp] = useState(null);
  const [tempHistory, setTempHistory] = useState([]);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const tempMinutoRef = collection(db, 'TempMinuto');
    const q = query(tempMinutoRef, orderBy('date', 'desc'), limit(1));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const latestTemp = snapshot.docs[0].data();
        setCurrentTemp(latestTemp);

        const newAlert = { date: latestTemp.date, message: '' };
        if (latestTemp.temperature < 3) {
          newAlert.message = 'La temperatura ha bajado de 3 grados';
        } else if (latestTemp.temperature > 8) {
          newAlert.message = 'La temperatura ha subido de 8 grados';
        }

        if (newAlert.message) {
          setAlerts(prevAlerts => [newAlert, ...prevAlerts.slice(0, 4)]);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchTempHistory = async () => {
      const tempMinutoRef = collection(db, 'TempMinuto');
      const q = query(tempMinutoRef, orderBy('date', 'desc'), limit(10));
      const snapshot = await getDocs(q);
      const history = snapshot.docs.map(doc => doc.data());
      setTempHistory(history);
    };

    fetchTempHistory();
  }, []);

  const formatDate = (dateString) => {
    if (dateString) {
      return new Date(dateString).toLocaleString();
    }
    return 'Fecha no disponible';
  };

  return (
    <>
      <ResponsiveAppBar />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom component="div">
          Monitoreo de Temperatura
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h6" gutterBottom>
                Temperatura Actual
              </Typography>
              {currentTemp && (
                <Box>
                  <Typography variant="h3" color="primary">
                    {currentTemp.temperature.toFixed(1)}°C
                  </Typography>
                  <Typography variant="body1">
                    Humedad: {currentTemp.humidity.toFixed(1)}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Hora: {currentTemp.time}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Fecha: {formatDate(currentTemp.date)}
                  </Typography>
                </Box>
              )}
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h6" gutterBottom>
                Registro de Alertas
              </Typography>
              {alerts.map((alert, index) => (
                <Alert key={index} severity="warning" sx={{ mb: 1 }}>
                  {alert.message} - {formatDate(alert.date)}
                </Alert>
              ))}
            </Paper>
          </Grid>
          
          <Grid item xs={12}>
            <Paper elevation={3} sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h6" gutterBottom>
                Historial de Temperaturas
              </Typography>
              <TableContainer>
                <Table aria-label="customized table">
                  <TableHead>
                    <TableRow>
                      <StyledTableCell>Temperatura (°C)</StyledTableCell>
                      <StyledTableCell>Humedad (%)</StyledTableCell>
                      <StyledTableCell>Hora</StyledTableCell>
                      <StyledTableCell>Fecha</StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {tempHistory.map((temp, index) => (
                      <StyledTableRow key={index}>
                        <StyledTableCell>{temp.temperature.toFixed(1)}</StyledTableCell>
                        <StyledTableCell>{temp.humidity.toFixed(1)}</StyledTableCell>
                        <StyledTableCell>{temp.time}</StyledTableCell>
                        <StyledTableCell>{temp.date}</StyledTableCell>
                      </StyledTableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default Temperature;