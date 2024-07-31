import * as React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { initializeApp } from "firebase/app";

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      <Link color="inherit" href="https://mui.com/">
      </Link>{' '}
      {''}
    </Typography>
  );
}

const defaultTheme = createTheme();

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

export default function LogIn() {
  const navigate = useNavigate();
  const [users, setUsers] = useState({});

  useEffect(() => {
    const fetchUsers = async () => {
      const usersCollection = collection(db, "Usuarios");
      const userSnapshot = await getDocs(usersCollection);
      const userList = {};
      userSnapshot.forEach((doc) => {
        userList[doc.id] = doc.data();
      });
      setUsers(userList);
    };

    fetchUsers();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const username = data.get('nombre');
    const password = data.get('password');
  
    if (users[username] && users[username].Password === password) {
      // Guardar el nombre del usuario en el almacenamiento local
      localStorage.setItem('currentUser', username);
      navigate('/home');
    } else {
      alert('Usuario o contraseña incorrectos');
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid container component="main" sx={{ height: '100vh' }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: 'url("https://img.freepik.com/fotos-premium/conjunto-jeringas-medicas-ampollas-medicamentos-vacunas-fila-sobre-fondo-azul_94046-5518.jpg")',
            backgroundColor: (t) =>
              t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
            backgroundSize: 'cover',
            backgroundPosition: 'left',
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Inicio de sesión
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="nombre"
                label="Nombre de usuario"
                name="nombre"
                autoComplete="nombre"
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Contraseña"
                type="password"
                id="password"
                autoComplete="current-password"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Iniciar Sesión
              </Button>
              <Copyright sx={{ mt: 5 }} />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}