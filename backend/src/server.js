const express = require("express");
const cors = require("cors");
const equiposRoutes = require("./routes/equipos");
const app = express();
const PORT = 3150;
const fs = require("fs");
app.use(cors());
app.use(express.json());
app.use(express.static('firma'))
app.use("/api/equipos", equiposRoutes);
app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});
