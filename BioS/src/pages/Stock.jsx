import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, Container, Typography, IconButton, Checkbox, Button, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, deleteDoc, doc, getDoc } from "firebase/firestore";
import ResponsiveAppBar from '../components/ResponsiveAppBar';
import BreadStock from '../components/BreadStock';

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

const verifyPassword = async (password) => {
  const username = localStorage.getItem('currentUser');
  if (!username) return false;

  const userDoc = doc(db, 'Usuarios', username);
  const userSnap = await getDoc(userDoc);

  if (userSnap.exists() && userSnap.data().Password === password) {
    return true;
  }
  return false;
};

const CustomizedTables = ({ vacunas, onDelete, onSelect }) => {
  return (
    <TableContainer component={Paper}>
      <Table aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Seleccionar</StyledTableCell>
            <StyledTableCell>Nombre</StyledTableCell>
            <StyledTableCell align="right">Fecha de caducidad</StyledTableCell>
            <StyledTableCell align="right">Cantidad</StyledTableCell>
            <StyledTableCell align="center">Acciones</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {vacunas.filter(vacuna => vacuna.cantidad > 0).map((vacuna) => (
            <StyledTableRow key={vacuna.id}>
              <StyledTableCell>
                <Checkbox onChange={(e) => onSelect(vacuna.id, e.target.checked)} />
              </StyledTableCell>
              <StyledTableCell component="th" scope="row">
                {vacuna.nVacunas}
              </StyledTableCell>
              <StyledTableCell align="right">{vacuna.fVacunas}</StyledTableCell>
              <StyledTableCell align="right">{vacuna.cantidad}</StyledTableCell>
              <StyledTableCell align="center">
                <IconButton onClick={() => onDelete(vacuna.id)}>
                  <DeleteIcon />
                </IconButton>
              </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const Stock = () => {
  const [vacunas, setVacunas] = useState([]);
  const [selectedVacunas, setSelectedVacunas] = useState([]);
  const [password, setPassword] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchVacunas();
  }, []);

  const fetchVacunas = async () => {
    const vacunasCollection = collection(db, 'Vacunas');
    const vacunasSnapshot = await getDocs(vacunasCollection);
    const vacunasList = vacunasSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setVacunas(vacunasList);
  };

  const handleDelete = async (id) => {
    setDeleteId(id);
    setOpenDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (await verifyPassword(password)) {
      await deleteDoc(doc(db, 'Vacunas', deleteId));
      fetchVacunas();
      setOpenDialog(false);
      setPassword('');
    } else {
      setError('Contraseña incorrecta');
    }
  };

  const handleSelect = (id, isSelected) => {
    if (isSelected) {
      setSelectedVacunas([...selectedVacunas, id]);
    } else {
      setSelectedVacunas(selectedVacunas.filter(vacunaId => vacunaId !== id));
    }
  };

  const handleDeleteSelected = async () => {
    setDeleteId('multiple');
    setOpenDialog(true);
  };
  const handleConfirmDeleteSelected = async () => {
    if (await verifyPassword(password)) {
      for (const id of selectedVacunas) {
        await deleteDoc(doc(db, 'Vacunas', id));
      }
      fetchVacunas();
      setSelectedVacunas([]);
      setOpenDialog(false);
      setPassword('');
    } else {
      setError('Contraseña incorrecta');
    }
  };

  return (
    <>
      <ResponsiveAppBar />
      <Container maxWidth="lg">
        <Box sx={{ mt: 4, mb: 4 }}>
          <BreadStock sx={{ mb: 2 }} />
          <Typography variant="h4" gutterBottom>
            Gestión de Stock de Vacunas
          </Typography>
          <Button 
            variant="contained" 
            color="secondary" 
            onClick={handleDeleteSelected}
            disabled={selectedVacunas.length === 0}
            sx={{ mb: 2 }}
          >
            Eliminar seleccionados
          </Button>
          <CustomizedTables 
            vacunas={vacunas} 
            onDelete={handleDelete}
            onSelect={handleSelect}
          />
        </Box>
      </Container>
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Confirmar eliminación</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {deleteId === 'multiple' 
              ? '¿Estás seguro de que deseas eliminar los medicamentos seleccionados?' 
              : '¿Estás seguro de que deseas eliminar este medicamento?'}
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Contraseña"
            type="password"
            fullWidth
            variant="standard"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <Typography color="error">{error}</Typography>}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
          <Button onClick={deleteId === 'multiple' ? handleConfirmDeleteSelected : handleConfirmDelete}>
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Stock;