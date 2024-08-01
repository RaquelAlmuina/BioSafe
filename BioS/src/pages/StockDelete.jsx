import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Box, Button, Typography, TextField, Card, CardContent } from '@mui/material';
import { initializeApp } from "firebase/app";
import { getFirestore, doc, deleteDoc, getDoc } from "firebase/firestore";
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

const StockDelete = () => {
  const { id } = useParams();
  const [vacuna, setVacuna] = useState(null);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVacuna = async () => {
      const docRef = doc(db, 'Vacunas', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setVacuna(docSnap.data());
      } else {
        navigate('/');
      }
    };

    fetchVacuna();
  }, [id, navigate]);

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleDelete = async () => {
    if (await verifyPassword(password)) {
      await deleteDoc(doc(db, 'Vacunas', id));
      navigate('/');
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
            Confirmar Eliminación
          </Typography>
          {vacuna && (
            <Card>
              <CardContent>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  ¿Estás seguro de que deseas eliminar la vacuna <strong>{vacuna.nVacunas}</strong> con fecha de caducidad <strong>{vacuna.fVacunas}</strong>?
                </Typography>
                <TextField
                  fullWidth
                  label="Contraseña"
                  type="password"
                  value={password}
                  onChange={handlePasswordChange}
                  sx={{ mb: 2 }}
                />
                <Button variant="contained" color="error" onClick={handleDelete} sx={{ mr: 2 }}>
                  Eliminar
                </Button>
                <Button variant="contained" onClick={() => navigate('/')}>
                  Cancelar
                </Button>
                {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}
              </CardContent>
            </Card>
          )}
        </Box>
      </Container>
    </>
  );
};

export default StockDelete;