const sql = require("mssql"); // Necesario para acceder a sql.NVarChar, sql.Int, etc.
const { getConnection } = require("../config/data"); // Importar la función getConnection
const { queriesEquipo } = require("../query"); // Importar las consultas

// Obtener todos los equipos
const getEquipos = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request().query(queriesEquipo.getEquipos);
    res.status(200).json(result.recordset); // Retorna la lista de equipos
  } catch (err) {
    console.error("Error al obtener equipos:", err.message);
    res
      .status(500)
      .json({ message: "Error al obtener los equipos", error: err.message });
  }
};

// Crear un nuevo equipo
const crearEquipo = async (req, res) => {
  const {
    tipo_equipo,
    marca,
    modelo,
    serie,
    activo_institucional,
    usuario_asignado,
    ubicacion,
    sistema_operativo,
    procesador,
    ram,
    fecha_compra,
    nombre_dispositivo,
    fecha_instalacion,
    ipActiva,
    ip,
    estado,
  } = req.body;
  console.log("k", estado);
  try {
    const pool = await getConnection(); // Obtener la conexión antes de hacer la consulta
    const result = await pool
      .request()
      .input("tipo_equipo", sql.NVarChar, tipo_equipo)
      .input("marca", sql.NVarChar, marca)
      .input("modelo", sql.NVarChar, modelo)
      .input("serie", sql.NVarChar, serie)
      .input("activo_institucional", sql.Bit, activo_institucional)
      .input("usuario_asignado", sql.NVarChar, usuario_asignado)
      .input("ubicacion", sql.NVarChar, ubicacion)
      .input("sistema_operativo", sql.NVarChar, sistema_operativo)
      .input("procesador", sql.NVarChar, procesador)
      .input("ram", sql.NVarChar, ram)
      .input("fecha_compra", sql.DateTime, fecha_compra)
      .input("nombre_dispositivo", sql.NVarChar, nombre_dispositivo)
      .input("fecha_instalacion", sql.DateTime, fecha_instalacion)
      .input("ipActiva", sql.Bit, ipActiva)
      .input("ip", sql.NVarChar, ip)
      .input("estado", sql.Bit, estado)
      .query(queriesEquipo.setEquipos);

    res.status(201).json({ message: "Equipo creado exitosamente" });
  } catch (err) {
    console.error("Error al crear equipo:", err.message);
    res
      .status(500)
      .json({ message: "Error al crear equipo", error: err.message });
  }
};

// Actualizar un equipo existente
const actualizarEquipo = async (req, res) => {
  const { id } = req.params;
  const {
    tipo_equipo,
    marca,
    modelo,
    serie,
    activo_institucional,
    usuario_asignado,
    ubicacion,
    sistema_operativo,
    procesador,
    ram,
    fecha_compra,
    nombre_dispositivo,
    fecha_instalacion,
    ipActiva,
    ip,
    tipo_mantenimiento,
    fecha_mantenimiento,
    hora_inicio,
    hora_fin,
    estado,
    usuarioBaja,
  } = req.body;

  try {
    const toDay = new Date();
    const result = await pool
      .request()
      .input("id", sql.Int, id)
      .input("tipo_equipo", sql.NVarChar, tipo_equipo)
      .input("marca", sql.NVarChar, marca)
      .input("modelo", sql.NVarChar, modelo)
      .input("serie", sql.NVarChar, serie)
      .input("activo_institucional", sql.Bit, activo_institucional)
      .input("usuario_asignado", sql.NVarChar, usuario_asignado)
      .input("ubicacion", sql.NVarChar, ubicacion)
      .input("sistema_operativo", sql.NVarChar, sistema_operativo)
      .input("procesador", sql.NVarChar, procesador)
      .input("ram", sql.Int, ram)
      .input("fecha_compra", sql.Date, fecha_compra)
      .input("nombre_dispositivo", sql.NVarChar, nombre_dispositivo)
      .input("fecha_instalacion", sql.Date, fecha_instalacion)
      .input("ipActiva", sql.NVarChar, ipActiva)
      .input("ip", sql.NVarChar, ip)
      .input("tipo_mantenimiento", sql.NVarChar, tipo_mantenimiento)
      .input("fecha_mantenimiento", sql.Date, fecha_mantenimiento)
      .input("hora_inicio", sql.Time, hora_inicio)
      .input("hora_fin", sql.Time, hora_fin)
      .input("estado", sql.Bit, estado)
      .input("usuarioBaja", sql.NVarChar, usuarioBaja || null)
      .input("fechaBaja", sql.DateTime, toDay || null)
      .query(queriesEquipo.uptEquipos);

    res.status(200).json({ message: "Equipo actualizado exitosamente" });
  } catch (err) {
    console.error("Error al actualizar equipo:", err.message);
    res
      .status(500)
      .json({ message: "Error al actualizar equipo", error: err.message });
  }
};

// Dar de baja un equipo

const darDeBajaEquipo = async (req, res) => {
  console.log("req.body:", req.body);
  console.log("req.params:", req.params);
  const { id } = req.params;
  const { usuarioBaja } = req.body; // ← Ahora es `usuarioBaja`

  // Validar que se envíe el usuario
  if (!usuarioBaja || usuarioBaja.trim() === "") {
    return res.status(400).json({
      message: "El usuario que da de baja es obligatorio",
    });
  }

  try {
    const pool = await getConnection();

    await pool
      .request()
      .input("id", sql.VarChar, id) // Ajusta a VarChar si usas string
      .input("usuarioBaja", sql.NVarChar, usuarioBaja)
      .query(queriesEquipo.uptbajaEquipo);

    console.log(`✅ Equipo ${id} dado de baja por: ${usuarioBaja}`);

    res.status(200).json({ message: "Equipo dado de baja exitosamente" });
  } catch (err) {
    console.error("Error al dar de baja:", err.message);
    res.status(500).json({
      message: "Error al dar de baja",
      error: err.message,
    });
  }
};

// Agregar mantenimiento a un equipo
const agregarMantenimiento = async (req, res) => {
  const { id } = req.params;
  const { tipo_mantenimiento, fecha_mantenimiento, hora_inicio, hora_fin } =
    req.body;

  try {
    const result = await pool
      .request()
      .input("id", sql.Int, id)
      .input("tipo_mantenimiento", sql.NVarChar, tipo_mantenimiento)
      .input("fecha_mantenimiento", sql.Date, fecha_mantenimiento)
      .input("hora_inicio", sql.Time, hora_inicio)
      .input("hora_fin", sql.Time, hora_fin)
      .query(queriesEquipo.setEquipos); // Aquí agregarías la consulta de mantenimiento si es diferente

    res.status(201).json({ message: "Mantenimiento agregado exitosamente" });
  } catch (err) {
    console.error("Error al agregar mantenimiento:", err.message);
    res
      .status(500)
      .json({ message: "Error al agregar mantenimiento", error: err.message });
  }
};

module.exports = {
  getEquipos,
  crearEquipo,
  actualizarEquipo,
  darDeBajaEquipo,
  agregarMantenimiento,
};