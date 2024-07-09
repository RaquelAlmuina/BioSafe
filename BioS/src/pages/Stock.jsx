import React from 'react';
import Breadcrumbs from '../components/Breadcrumbs';
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

function createData(id, name, lote, expirationDate) {
  return { id, name, lote, expirationDate };
}

const rows = [
  createData(1, 'Frozen yoghurt', 'L001', '2024-07-15'),
  createData(2, 'Ice cream sandwich', 'L002', '2024-08-01'),
  createData(3, 'Eclair', 'L003', '2024-07-20'),
  createData(4, 'Cupcake', 'L004', '2024-07-25'),
  createData(5, 'Gingerbread', 'L005', '2024-08-10'),
];

const CustomizedTables = () => {
  return (
    <TableContainer component={Paper}>
      <Table aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell style={{ width: '10%' }}>ID</StyledTableCell>
            <StyledTableCell align="right">Nombre</StyledTableCell>
            <StyledTableCell align="right">Lote</StyledTableCell>
            <StyledTableCell align="right">Fecha de caducidad</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <StyledTableRow key={row.id}>
              <StyledTableCell component="th" scope="row" style={{ width: '10%' }}>
                {row.id}
              </StyledTableCell>
              <StyledTableCell align="right">{row.name}</StyledTableCell>
              <StyledTableCell align="right">{row.lote}</StyledTableCell>
              <StyledTableCell align="right">{row.expirationDate}</StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const Stock = () => {
  return (
    <div>
      <ResponsiveAppBar />
      <Box sx={{ p: 3, maxWidth: '90%', margin: 'auto' }}>
        <Breadcrumbs sx={{ mb: 2 }} />
        <CustomizedTables />
      </Box>
    </div>
  );
};

export default Stock;