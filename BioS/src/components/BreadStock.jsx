import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';

export default function BreadStock() {
  const navigate = useNavigate();

  const handleClick = (path) => (event) => {
    event.preventDefault();
    navigate(path);
  };

  return (
    <div role="presentation">
      <Breadcrumbs aria-label="breadcrumb">
        <Link
          underline="hover"
          color="inherit"
          onClick={handleClick('/stock')}
        >
          Stock
        </Link>
        <Link
          underline="hover"
          color="inherit"
          onClick={handleClick('/stock/create')} // Ruta para StockCreate
        >
          Entradas
        </Link>
      </Breadcrumbs>
    </div>
  );
}
