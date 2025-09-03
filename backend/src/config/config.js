require("dotenv").config();


const config = {
  port: process.env.PORT || 3130,
  dbUser: process.env.DB_USER || "",
  dbPassword: process.env.DB_PASSWORD || "",
  dbServer: process.env.DB_SERVER || "",
  dbDatabase: process.env.DB_DATABASE || "",
};



// Exportar la conexión y el pool
module.exports = config;


