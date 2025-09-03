const sql = require("mssql");
const { default: config } = require("./config");
require("dotenv").config();

const dbSettings = {
  user: process.env.DB_USER || "",
  password: process.env.DB_PASSWORD || "",
  server: process.env.DB_SERVER || "",
  database: process.env.DB_DATABASE || "",
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
  requestTimeout: 60000, // Tiempo máximo para una consulta (60 segundos)
  pool: {
    idleTimeoutMillis: 30000, // Tiempo máximo de inactividad (30 segundos)
  },
};

let pool;


async function getConnection() {
  try {
    if (!pool) {
      pool = new sql.ConnectionPool(dbSettings);
      await pool.connect();
    } else if (!pool.connected) {
      await pool.connect(); // Reconecta si se cerró.
    }
    return pool;
  } catch (err) {
    console.error("Error al conectar con la base de datos p1:", err);
    throw err;
  }
}

// Exportar la conexión y el pool
module.exports = { sql, getConnection, pool };
