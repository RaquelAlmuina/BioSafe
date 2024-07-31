import React from 'react';
import ResponsiveAppBar from '../components/ResponsiveAppBar';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Container from '@mui/material/Container';

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

function createData(id, nombre, fechaCaducidad, carbs, protein) {
  return { id, nombre, fechaCaducidad, carbs, protein };
}

const rows = [
  createData(1, 'Producto A', '2023-12-31', 24, 4.0),
  createData(2, 'Producto B', '2023-11-30', 37, 4.3),
  createData(3, 'Producto C', '2024-01-15', 24, 6.0),
  createData(4, 'Producto D', '2023-10-31', 67, 4.3),
  createData(5, 'Producto E', '2024-02-28', 49, 3.9),
];

const CustomizedTables = () => {
  return (
    <TableContainer component={Paper}>
      <Table aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>ID</StyledTableCell>
            <StyledTableCell align="right">Nombre</StyledTableCell>
            <StyledTableCell align="right">Fecha de caducidad</StyledTableCell>
            <StyledTableCell align="right">Carbs&nbsp;(g)</StyledTableCell>
            <StyledTableCell align="right">Protein&nbsp;(g)</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <StyledTableRow key={row.id}>
              <StyledTableCell component="th" scope="row">
                {row.id}
              </StyledTableCell>
              <StyledTableCell align="right">{row.nombre}</StyledTableCell>
              <StyledTableCell align="right">{row.fechaCaducidad}</StyledTableCell>
              <StyledTableCell align="right">{row.carbs}</StyledTableCell>
              <StyledTableCell align="right">{row.protein}</StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const Temperature = () => {
  return (
    <div>
      <ResponsiveAppBar />
      <Container maxWidth="lg" style={{ marginTop: '2rem' }}>
        <h1>Temperatura</h1>
        <CustomizedTables />
      </Container>
    </div>
  );
};

export default Temperature;