import React from 'react';
import { Box, Container, Grid, Paper } from '@mui/material';
import { Link } from 'react-router-dom';
import ResponsiveAppBar from '../components/ResponsiveAppBar';
import DeviceThermostatSharpIcon from '@mui/icons-material/DeviceThermostatSharp';
import VaccinesSharpIcon from '@mui/icons-material/VaccinesSharp';
import PeopleAltSharpIcon from '@mui/icons-material/PeopleAltSharp';

const Home = () => {
  const icons = [
    { Icon: DeviceThermostatSharpIcon, label: 'Temperatura', path: '/temperature' },
    { Icon: VaccinesSharpIcon, label: 'Inventario', path: '/stock' },
    { Icon: PeopleAltSharpIcon, label: 'Accesos', path: '/access' },
  ];

  return (
    <div>
      <ResponsiveAppBar />
      <Container maxWidth="lg">
        <Box sx={{ my: 4, textAlign: 'center' }}>
          <h1>Bienvenido Maffiado</h1>
          <Grid container spacing={4} justifyContent="center">
            {icons.map(({ Icon, label, path }, index) => (
              <Grid item key={index} xs={12} sm={6} md={4}>
                <Link to={path} style={{ textDecoration: 'none' }}>
                  <Paper
                    elevation={3}
                    sx={{
                      p: 3,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      height: '200px',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.3s',
                      '&:hover': {
                        transform: 'scale(1.05)',
                        boxShadow: '0 8px 16px 0 rgba(0,0,0,0.2)',
                      },
                    }}
                  >
                    <Icon sx={{ fontSize: 80, mb: 2 }} />
                    <Box sx={{ mt: 2, fontSize: '1.2rem' }}>{label}</Box>
                  </Paper>
                </Link>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </div>
  );
};

export default Home;