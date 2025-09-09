import React, { useState } from "react";
import { agregarMantenimiento } from "../services/api";
import "../assets/ModalMantenimiento.css";

const ModalMantenimiento = ({ equipoId, onClose, onGuardar }) => {
  const [mantenimiento, setMantenimiento] = useState({
    tipo_mantenimiento: "",
    fecha_mantenimiento: "",
    hora_inicio: "",
    hora_fin: "",
    observaciones: "",
    usuario_registro: "",
  });

  const [errores, setErrores] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMantenimiento({ ...mantenimiento, [name]: value });
    // Limpiar error al escribir
    if (errores[name]) {
      setErrores({ ...errores, [name]: "" });
    }
  };

  const validar = () => {
    const nuevosErrores = {};
    if (
      !mantenimiento.tipo_mantenimiento ||
      !mantenimiento.tipo_mantenimiento.trim()
    ) {
      nuevosErrores.tipo_mantenimiento =
        "Debe seleccionar un tipo de mantenimiento";
    }

    if (!mantenimiento.fecha_mantenimiento) {
      nuevosErrores.fecha_mantenimiento = "La fecha es obligatoria";
    }

    if (!mantenimiento.hora_inicio) {
      nuevosErrores.hora_inicio = "Hora de inicio requerida";
    } else if (!/^[0-2]\d:[0-5]\d$/.test(mantenimiento.hora_inicio)) {
      nuevosErrores.hora_inicio = "Formato de hora inválido";
    }

    if (!mantenimiento.hora_fin) {
      nuevosErrores.hora_fin = "Hora de finalización requerida";
    } else if (!/^[0-2]\d:[0-5]\d$/.test(mantenimiento.hora_fin)) {
      nuevosErrores.hora_fin = "Formato de hora inválido";
    }
    if (!mantenimiento.usuario_registro.trim()) {
      nuevosErrores.usuario_registro =
        "Debe indicar la persona que realizó el mantenimiento";
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validar()) return;
    console.log("Enviando mantenimiento:", mantenimiento);
    try {
      await agregarMantenimiento(equipoId, mantenimiento);
      onGuardar(); // Notificar al padre
      onClose(); // Cerrar modal
    } catch (err) {
      alert("Error al registrar mantenimiento");
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>➕ Agregar Mantenimiento</h3>

        <form onSubmit={handleSubmit}>
          {/* Tipo de mantenimiento */}
          <div className="form-group">
            <label>Tipo de mantenimiento:</label>
            <div className="checkbox-group">
              {[
                "Preventivo",
                "Correctivo",
                "Actualización",
                "Instalación de software",
                "Limpieza física",
              ].map((tipo) => (
                <label key={tipo} className="checkbox-label">
                  <input
                    type="checkbox"
                    name="tipo_mantenimiento"
                    value={tipo}
                    checked={mantenimiento.tipo_mantenimiento === tipo}
                    onChange={handleChange}
                  />
                  {tipo}
                </label>
              ))}
              <input
                type="text"
                placeholder="Otro..."
                value={mantenimiento.tipo_mantenimiento}
                onChange={(e) =>
                  setMantenimiento({
                    ...mantenimiento,
                    tipo_mantenimiento: e.target.value,
                  })
                }
                className="input-otro"
                name="tipo_mantenimiento"
              />
            </div>
            {errores.tipo_mantenimiento && (
              <span className="error-message">
                {errores.tipo_mantenimiento}
              </span>
            )}
          </div>

          {/* Fecha y horas */}
          <div className="form-row">
            <div className="form-group">
              <label>Fecha:</label>
              <input
                type="date"
                name="fecha_mantenimiento"
                value={mantenimiento.fecha_mantenimiento}
                onChange={handleChange}
                className={errores.fecha_mantenimiento ? "input-error" : ""}
              />
              {errores.fecha_mantenimiento && (
                <span className="error-message">
                  {errores.fecha_mantenimiento}
                </span>
              )}
            </div>

            <div className="form-group">
              <label>Hora inicio:</label>
              <input
                type="time"
                name="hora_inicio"
                value={mantenimiento.hora_inicio}
                onChange={handleChange}
                className={errores.hora_inicio ? "input-error" : ""}
              />
              {errores.hora_inicio && (
                <span className="error-message">{errores.hora_inicio}</span>
              )}
            </div>

            <div className="form-group">
              <label>Hora fin:</label>
              <input
                type="time"
                name="hora_fin"
                value={mantenimiento.hora_fin}
                onChange={handleChange}
                className={errores.hora_fin ? "input-error" : ""}
              />
              {errores.hora_fin && (
                <span className="error-message">{errores.hora_fin}</span>
              )}
            </div>
          </div>

          {/* Persona que realizó el mantenimiento */}
          <div className="form-group">
            <label>Persona que realizó el mantenimiento:</label>
            <input
              type="text"
              name="usuario_registro"
              value={mantenimiento.usuario_registro}
              onChange={handleChange}
              placeholder="Nombre completo"
              className={errores.usuario_registro ? "input-error" : ""}
              style={{ width: "100%" }}
            />
            {errores.usuario_registro && (
              <span className="error-message">{errores.usuario_registro}</span>
            )}
          </div>

          {/* Observaciones */}
          <div className="form-group">
            <label>Observaciones:</label>
            <textarea
              name="observaciones"
              value={mantenimiento.observaciones}
              onChange={handleChange}
              placeholder="Detalles del mantenimiento..."
            />
          </div>

          {/* Botones */}
          <div className="modal-actions">
            <button type="submit" className="btn-primary">
              Guardar
            </button>
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalMantenimiento;
