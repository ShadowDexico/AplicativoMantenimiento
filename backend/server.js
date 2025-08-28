
const express = require('express');
const cors = require('cors');
const equiposRoutes = require('./routes/equipos');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.use('/api/equipos', equiposRoutes);

app.listen(PORT, () => {
    console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});