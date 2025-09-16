const express = require("express");
const router = express.Router();
const multer = require("multer");

const upload = multer({ dest: "firma/" });

const {
  getEquipos,
  crearEquipo,
  actualizarEquipo,
  darDeBajaEquipo,
  agregarMantenimiento,
  getMantenimientosPorEquipo,
  eliminarEquipo,
  actualizarMantenimiento,
  eliminarMantenimiento,
} = require("../controllers/equiposController");

router.get("/", getEquipos);
router.post("/", crearEquipo);
router.put("/:id", actualizarEquipo);
router.patch("/:id/baja", darDeBajaEquipo);
router.post("/mantenimientos", upload.single("firma"), agregarMantenimiento);
router.get("/:id/mantenimientos", getMantenimientosPorEquipo);
router.delete("/:id", eliminarEquipo);
router.put("/mantenimientos/:id", actualizarMantenimiento);
router.delete("/mantenimientos/:id", eliminarMantenimiento);

module.exports = router;
