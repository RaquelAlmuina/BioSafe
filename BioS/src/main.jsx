// index.js o main.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import LogIn from './pages/LogIn';
import Home from './pages/Home';
import ResponsiveAppBar from './components/ResponsiveAppBar';
import Stock from './pages/Stock';
import { CssBaseline } from '@mui/material';
import Access from './pages/Access';
import Temperature from './pages/Temperature';
import StockCreate from './pages/StockCreate';
import StockDelete from './pages/StockDelete';



const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/home" replace />,
  },
  {
    path: '/login',
    element: <LogIn />,
    errorElement: <h1>Error</h1>,
  },
  {
    path: '/home',
    element: <Home />,
    errorElement: <h1>Error</h1>,
  },
  {
    path: '/appbar',
    element: <ResponsiveAppBar />,
    errorElement: <h1>Error</h1>,
  },
  {
    path: '/stock',
    element: <Stock />,
    errorElement: <h1>Error</h1>,
  },
  {
    path: '/access',
    element: <Access />,
    errorElement: <h1>Error</h1>,
  },
  {
    path: '/temperature',
    element: <Temperature />,
    errorElement: <h1>Error</h1>,
  },
  {
    path: '*',
    element: <h1>404: Página no encontrada</h1>,
  },
  {
    path: '/entradas',
    element: <StockCreate />,
    errorElement: <h1>Error</h1>,
  },
  {
    path: '/salidas',
    element: <StockDelete />,
    errorElement: <h1>Error</h1>,
  },
]);

const Root = () => (
  <React.StrictMode>
    <CssBaseline />
    <RouterProvider router={router} />
  </React.StrictMode>
);

ReactDOM.createRoot(document.getElementById('root')).render(<Root />);