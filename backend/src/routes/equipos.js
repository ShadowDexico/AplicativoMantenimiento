const express = require("express");
const router = express.Router();
const {
  getEquipos,
  crearEquipo,
  actualizarEquipo,
  darDeBajaEquipo,
  agregarMantenimiento,
  getMantenimientosPorEquipo,
  eliminarEquipo,
} = require("../controllers/equiposController");

router.get("/", getEquipos);
router.post("/", crearEquipo);
router.put("/:id", actualizarEquipo);
router.patch("/:id/baja", darDeBajaEquipo);
router.post("/:id/mantenimientos", agregarMantenimiento);
router.get("/:id/mantenimientos", getMantenimientosPorEquipo);
router.delete("/:id", eliminarEquipo);

module.exports = router;
