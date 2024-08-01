import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Box, TextField, Button, Typography, Card, CardContent, Grid, Snackbar } from '@mui/material';
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, doc, getDoc } from "firebase/firestore";
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

const StockCreate = () => {
  const [medicamentos, setMedicamentos] = useState([{ nVacunas: '', fVacunas: '', cantidad: 0 }]);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (index, e) => {
    const { name, value } = e.target;
    const newMedicamentos = [...medicamentos];
    newMedicamentos[index] = { ...newMedicamentos[index], [name]: value };
    setMedicamentos(newMedicamentos);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleAddMedicamento = () => {
    setMedicamentos([...medicamentos, { nVacunas: '', fVacunas: '', cantidad: 0 }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (await verifyPassword(password)) {
      for (const medicamento of medicamentos) {
        await addDoc(collection(db, 'Vacunas'), medicamento);
      }
      setOpenSnackbar(true);
      setTimeout(() => navigate('/'), 2000);
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
            Añadir Nuevos Medicamentos
          </Typography>
          <Card>
            <CardContent>
              <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4 }}>
                {medicamentos.map((medicamento, index) => (
                  <Grid container spacing={2} key={index} sx={{ mb: 2 }}>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        fullWidth
                        name="nVacunas"
                        label="Nombre del medicamento"
                        value={medicamento.nVacunas}
                        onChange={(e) => handleInputChange(index, e)}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        fullWidth
                        name="fVacunas"
                        label="Fecha de caducidad"
                        type="date"
                        value={medicamento.fVacunas}
                        onChange={(e) => handleInputChange(index, e)}
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        fullWidth
                        name="cantidad"
                        label="Cantidad"
                        type="number"
                        value={medicamento.cantidad}
                        onChange={(e) => handleInputChange(index, e)}
                      />
                    </Grid>
                  </Grid>
                ))}
                <Button onClick={handleAddMedicamento} variant="outlined" sx={{ mb: 2 }}>
                  Añadir otro medicamento
                </Button>
                <TextField
                  fullWidth
                  label="Contraseña"
                  type="password"
                  value={password}
                  onChange={handlePasswordChange}
                  sx={{ mb: 2 }}
                />
                <Button type="submit" variant="contained" fullWidth>Añadir Medicamentos</Button>
                {error && <Typography color="error">{error}</Typography>}
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Container>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={2000}
        message="Medicamentos añadidos correctamente"
      />
    </>
  );
};

export default StockCreate;