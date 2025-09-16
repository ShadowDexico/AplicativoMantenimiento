const sql = require("mssql"); // Necesario para acceder a sql.NVarChar, sql.Int, etc.
const { getConnection } = require("../config/data"); // Importar la función getConnection
const { queriesEquipo } = require("../query"); // Importar las consultas
const fs = require("fs");

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

function SaveFirma(firma) {
  if (firma) {
    const newPath = `./firma/${Date.now() + firma.filename}.jpg`;
    fs.renameSync(firma.path, newPath);
    return newPath;
  } else {
    return 'null';
  }
}

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
    disco,
  } = req.body;
  try {
    const pool = await getConnection(); // Obtener la conexión antes de hacer la consulta
    const result = await pool
      .request()
      .input("tipo_equipo", sql.NVarChar, tipo_equipo)
      .input("marca", sql.NVarChar, marca)
      .input("modelo", sql.NVarChar, modelo)
      .input("serie", sql.NVarChar, serie)
      .input("activo_institucional", sql.NVarChar, activo_institucional)
      .input("usuario_asignado", sql.NVarChar, usuario_asignado)
      .input("ubicacion", sql.NVarChar, ubicacion)
      .input("sistema_operativo", sql.NVarChar, sistema_operativo)
      .input("procesador", sql.NVarChar, procesador)
      .input("ram", sql.NVarChar, ram)
      .input("disco", sql.NVarChar, disco)
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
    estado,
    usuarioBaja,
    disco,
  } = req.body;

  try {
    const toDay = new Date();
    const pool = await getConnection();
    const result = await pool
      .request()
      .input("id", sql.Int, id)
      .input("tipo_equipo", sql.NVarChar, tipo_equipo)
      .input("marca", sql.NVarChar, marca)
      .input("modelo", sql.NVarChar, modelo)
      .input("serie", sql.NVarChar, serie)
      .input("activo_institucional", sql.NVarChar, activo_institucional)
      .input("usuario_asignado", sql.NVarChar, usuario_asignado)
      .input("ubicacion", sql.NVarChar, ubicacion)
      .input("sistema_operativo", sql.NVarChar, sistema_operativo)
      .input("procesador", sql.NVarChar, procesador)
      .input("ram", sql.NVarChar, ram)
      .input("disco", sql.NVarChar, disco)
      .input("fecha_compra", sql.DateTime, fecha_compra)
      .input("nombre_dispositivo", sql.NVarChar, nombre_dispositivo)
      .input("fecha_instalacion", sql.DateTime, fecha_instalacion)
      .input("ipActiva", sql.Bit, ipActiva)
      .input("ip", sql.NVarChar, ip)
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
  const { id } = req.params;
  const { usuarioBaja } = req.body;

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
    res.status(200).json({ message: "Equipo dado de baja exitosamente" });
  } catch (err) {
    console.error("Error al dar de baja:", err.message);
    res.status(500).json({
      message: "Error al dar de baja",
      error: err.message,
    });
  }
};

const agregarMantenimiento = async (req, res) => {
  const {
    equipoId,
    tipo_mantenimiento,
    fecha_mantenimiento,
    hora_inicio,
    hora_fin,
    observaciones,
    usuario_registro,
  } = req.body;
  const firmaPath = req.file;
  if (
    !tipo_mantenimiento ||
    !fecha_mantenimiento ||
    !hora_inicio ||
    !hora_fin ||
    !usuario_registro
  ) {
    return res.status(400).json({
      message:
        "Todos los campos son obligatorios, incluyendo 'quien realizó el mantenimiento'",
    });
  }
  // ✅ Validación básica
  if (!tipo_mantenimiento || !tipo_mantenimiento.trim()) {
    return res
      .status(400)
      .json({ message: "Tipo de mantenimiento es obligatorio" });
  }
  if (!fecha_mantenimiento) {
    return res
      .status(400)
      .json({ message: "Fecha de mantenimiento es obligatoria" });
  }
  if (!hora_inicio || !hora_fin) {
    return res.status(400).json({ message: "Las horas son obligatorias" });
  }

  try {
    const pool = await getConnection();

    // ✅ Formatear horas a HH:mm:ss para TIME(7)
    const formatearHora = (hora) => {
      if (!hora) return null;
      // Si es HH:mm, convierte a HH:mm:ss
      return hora.length === 5 ? `${hora}:00` : hora;
    };

    const horaInicioFormateada = formatearHora(hora_inicio);
    const horaFinFormateada = formatearHora(hora_fin);

    await pool
      .request()
      .input("equipoId", sql.Int, Number(equipoId))
      .input("tipo_mantenimiento", sql.NVarChar, tipo_mantenimiento)
      .input("fecha_mantenimiento", sql.Date, fecha_mantenimiento)
      .input("hora_inicio", horaInicioFormateada)
      .input("hora_fin", horaFinFormateada)
      .input("observaciones", sql.NVarChar, observaciones || null)
      .input("usuario_registro", sql.NVarChar, usuario_registro)
      .input("firma", sql.NVarChar, SaveFirma(firmaPath))
      .query(queriesEquipo.setMantenimiento);

    res.status(201).json({
      message: "Mantenimiento registrado exitosamente",
    });
  } catch (err) {
    console.error("Error al agregar mantenimiento:", err.message);
    res.status(500).json({
      message: "Error al registrar mantenimiento",
      error: err.message,
    });
  }
};

const getMantenimientosPorEquipo = async (req, res) => {
  const { id } = req.params;
  try {
    const pool = await getConnection();
    const result = await pool
      .request()
      .input("equipoId", sql.Int, parseInt(id))
      .query(queriesEquipo.getMantenimientosPorEquipo);

    res.status(200).json(result.recordset);
  } catch (err) {
    console.error("Error al obtener mantenimientos:", err.message);
    res.status(500).json({
      message: "Error al obtener mantenimientos",
      error: err.message,
    });
  }
};

const eliminarEquipo = async (req, res) => {
  const { id } = req.params;

  if (!id || isNaN(parseInt(id))) {
    return res.status(400).json({
      message: "ID de equipo inválido",
    });
  }

  try {
    const pool = await getConnection();
    // 1. Verificar si tiene mantenimientos
    const result = await pool
      .request()
      .input("equipoId", sql.Int, parseInt(id))
      .query(
        "SELECT COUNT(*) as count FROM Mantenimientos WHERE equipoId = @equipoId"
      );

    const tieneMantenimientos = result.recordset[0].count > 0;
    if (tieneMantenimientos) {
      return res.status(400).json({
        message:
          "No se puede eliminar el equipo porque tiene mantenimientos asociados",
      });
    }
    // 2. Si no tiene mantenimientos, eliminar
    await pool
      .request()
      .input("id", sql.Int, parseInt(id))
      .query("DELETE FROM Equipos WHERE id = @id");

    res.status(200).json({ message: "Equipo eliminado exitosamente" });
  } catch (err) {
    console.error("Error al eliminar equipo:", err.message);
    res.status(500).json({
      message: "Error al eliminar equipo",
      error: err.message,
    });
  }
};

const actualizarMantenimiento = async (req, res) => {
  const { id } = req.params;
  const {
    tipo_mantenimiento,
    fecha_mantenimiento,
    hora_inicio,
    hora_fin,
    observaciones,
    usuario_registro,
  } = req.body;

  if (
    !tipo_mantenimiento ||
    !fecha_mantenimiento ||
    !hora_inicio ||
    !hora_fin ||
    !usuario_registro
  ) {
    return res.status(400).json({
      message: "Todos los campos son obligatorios",
    });
  }

  try {
    const pool = await getConnection();
    const formatearHora = (hora) => {
      if (!hora) return null;
      return hora.length === 5 ? `${hora}:00` : hora;
    };

    const horaInicioFormateada = formatearHora(hora_inicio);
    const horaFinFormateada = formatearHora(hora_fin);

    const result = await pool
      .request()
      .input("id", sql.Int, parseInt(id))
      .input("tipo_mantenimiento", sql.NVarChar, tipo_mantenimiento)
      .input("fecha_mantenimiento", sql.Date, fecha_mantenimiento)
      .input("hora_inicio", horaInicioFormateada)
      .input("hora_fin", horaFinFormateada)
      .input("observaciones", sql.NVarChar, observaciones || null)
      .input("usuario_registro", sql.NVarChar, usuario_registro)
      .query(queriesEquipo.uptMantenimiento);

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ message: "Mantenimiento no encontrado" });
    }
    res.status(200).json({ message: "Mantenimiento actualizado" });
  } catch (err) {
    console.error("Error al actualizar mantenimiento:", err.message);
    res.status(500).json({
      message: "Error interno",
      error: err.message,
    });
  }
};

const eliminarMantenimiento = async (req, res) => {
  const { id } = req.params;

  try {
    const pool = await getConnection();

    // Verificar que exista
    const check = await pool
      .request()
      .input("id", sql.Int, parseInt(id))
      .query("SELECT id FROM Mantenimientos WHERE id = @id");

    if (check.recordset.length === 0) {
      return res.status(404).json({ message: "Mantenimiento no encontrado" });
    }

    // Eliminar
    await pool
      .request()
      .input("id", sql.Int, parseInt(id))
      .query("DELETE FROM Mantenimientos WHERE id = @id");

    res.status(200).json({ message: "Mantenimiento eliminado exitosamente" });
  } catch (err) {
    console.error("Error al eliminar mantenimiento:", err.message);
    res.status(500).json({
      message: "Error al eliminar mantenimiento",
      error: err.message,
    });
  }
};

module.exports = {
  getEquipos,
  crearEquipo,
  actualizarEquipo,
  darDeBajaEquipo,
  agregarMantenimiento,
  getMantenimientosPorEquipo,
  eliminarEquipo,
  actualizarMantenimiento,
  eliminarMantenimiento,
};
