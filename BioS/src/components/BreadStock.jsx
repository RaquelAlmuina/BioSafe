import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';
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
          href="/stock"
          onClick={handleClick('/stock')}
        >
          Stock
        </Link>
        <Link
          underline="hover"
          color="inherit"
          href="/entradas"
          onClick={handleClick('/entradas')}
        >
          Entradas
        </Link>
        <Link
          underline="hover"
          color="inherit"
          href="/salidas"
          onClick={handleClick('/salidas')}
        >
          Salidas
        </Link>
      </Breadcrumbs>
    </div>
  );
}