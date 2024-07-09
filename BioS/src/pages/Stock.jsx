import React, { useState, useEffect } from 'react';
import BreadStock from '../components/BreadStock';
import ResponsiveAppBar from '../components/ResponsiveAppBar';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";


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
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.grey[800],
    color: theme.palette.common.white,
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
}));

const CustomizedTables = ({ vacunas, onEdit, onDelete }) => {
  return (
    <TableContainer component={Paper}>
      <Table aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>ID</StyledTableCell>
            <StyledTableCell align="right">Nombre</StyledTableCell>
            <StyledTableCell align="right">Fecha de caducidad</StyledTableCell>
            <StyledTableCell align="right">Acciones</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {vacunas.map((vacuna) => (
            <StyledTableRow key={vacuna.id}>
              <StyledTableCell component="th" scope="row">
                {vacuna.id}
              </StyledTableCell>
              <StyledTableCell align="right">{vacuna.nVacunas}</StyledTableCell>
              <StyledTableCell align="right">{vacuna.fVacunas}</StyledTableCell>
              <StyledTableCell align="right">
                <Button onClick={() => onEdit(vacuna)}>Editar</Button>
                <Button onClick={() => onDelete(vacuna.id)}>Eliminar</Button>
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
  const [currentVacuna, setCurrentVacuna] = useState({ nVacunas: '', fVacunas: '' });
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    fetchVacunas();
  }, []);

  const fetchVacunas = async () => {
    const vacunasCollection = collection(db, 'Vacunas');
    const vacunasSnapshot = await getDocs(vacunasCollection);
    const vacunasList = vacunasSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setVacunas(vacunasList);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentVacuna({ ...currentVacuna, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editing) {
      await updateDoc(doc(db, 'Vacunas', currentVacuna.id), currentVacuna);
    } else {
      await addDoc(collection(db, 'Vacunas'), currentVacuna);
    }
    setCurrentVacuna({ nVacunas: '', fVacunas: '' });
    setEditing(false);
    fetchVacunas();
  };

  const handleEdit = (vacuna) => {
    setCurrentVacuna(vacuna);
    setEditing(true);
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, 'Vacunas', id));
    fetchVacunas();
  };

  return (
    <div>
      <ResponsiveAppBar />
      <Box sx={{ p: 3, maxWidth: '90%', margin: 'auto' }}>
        <BreadStock sx={{ mb: 2 }} />
        <form onSubmit={handleSubmit}>
          <TextField
            name="nVacunas"
            label="Nombre de la vacuna"
            value={currentVacuna.nVacunas}
            onChange={handleInputChange}
          />
          <TextField
            name="fVacunas"
            label="Fecha de caducidad"
            value={currentVacuna.fVacunas}
            onChange={handleInputChange}
          />
          <Button type="submit">{editing ? 'Actualizar' : 'Añadir'} Vacuna</Button>
        </form>
        <CustomizedTables vacunas={vacunas} onEdit={handleEdit} onDelete={handleDelete} />
      </Box>
    </div>
  );
};

export default Stock;