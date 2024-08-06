import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import ResponsiveAppBar from '../components/ResponsiveAppBar';
import { styled, useTheme } from '@mui/material/styles';
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Paper, Typography, Container, Box, CircularProgress, Card, CardContent,
  Button, Chip, Tooltip, IconButton, useMediaQuery
} from '@mui/material';
import { tableCellClasses } from '@mui/material/TableCell';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import RefreshIcon from '@mui/icons-material/Refresh';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PersonIcon from '@mui/icons-material/Person';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAld7h21LTJtIn8doNLYsRWznaoF0gWzfo",
  authDomain: "biosafe2-90221.firebaseapp.com",
  projectId: "biosafe2-90221",
  storageBucket: "biosafe2-90221.appspot.com",
  messagingSenderId: "502286797810",
  appId: "1:502286797810:web:a7fab35ea050ca428e396b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
  [`&.${tableCellClasses.body}`]: {
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
  '&:hover': {
    backgroundColor: theme.palette.action.selected,
    transition: 'background-color 0.3s ease',
  },
}));

const Access = () => {
  const [entradas, setEntradas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const fetchEntradas = async () => {
    setLoading(true);
    try {
      const entradasCollection = collection(db, 'Entradas');
      const q = query(entradasCollection, orderBy('date', 'desc'), orderBy('time', 'desc'), limit(50));
      const entradasSnapshot = await getDocs(q);
      const entradasList = entradasSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setEntradas(entradasList);
      setLastRefresh(new Date());
    } catch (error) {
      console.error("Error fetching data: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntradas();
  }, []);

  const handleRefresh = () => {
    fetchEntradas();
  };

  return (
    <div style={{ backgroundColor: theme.palette.background.default, minHeight: '100vh' }}>
      <ResponsiveAppBar />
      <Container maxWidth="lg" sx={{ pt: 4, pb: 4 }}>
        <Card elevation={6} sx={{ borderRadius: 4, overflow: 'hidden' }}>
          <CardContent sx={{ p: 0 }}>
            <Box sx={{ 
              bgcolor: 'primary.main', 
              color: 'primary.contrastText', 
              p: 3, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <LockOpenIcon sx={{ fontSize: 40, mr: 2 }} />
                <Typography variant="h4" component="h1" fontWeight="bold">
                  Registro de Acceso
                </Typography>
              </Box>
              <Tooltip title="Actualizar datos">
                <IconButton onClick={handleRefresh} color="inherit">
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
            </Box>
            <Box sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Última actualización: {lastRefresh.toLocaleString()}
                </Typography>
                <Chip 
                  label={`${entradas.length} registros`} 
                  color="primary" 
                  size="small"
                />
              </Box>
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <TableContainer component={Paper} elevation={0}>
                  <Table sx={{ minWidth: 650 }} aria-label="customized table">
                    <TableHead>
                      <TableRow>
                        <StyledTableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <PersonIcon sx={{ mr: 1 }} /> Nombre
                          </Box>
                        </StyledTableCell>
                        <StyledTableCell align="right">
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                            <CalendarTodayIcon sx={{ mr: 1 }} /> Fecha
                          </Box>
                        </StyledTableCell>
                        <StyledTableCell align="right">
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                            <AccessTimeIcon sx={{ mr: 1 }} /> Hora
                          </Box>
                        </StyledTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {entradas.map((entrada) => (
                        <StyledTableRow key={entrada.id}>
                          <StyledTableCell component="th" scope="row">
                            {entrada.Nombre}
                          </StyledTableCell>
                          <StyledTableCell align="right">{entrada.date}</StyledTableCell>
                          <StyledTableCell align="right">{entrada.time}</StyledTableCell>
                        </StyledTableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Box>
          </CardContent>
        </Card>
      </Container>
    </div>
  );
};

export default Access;