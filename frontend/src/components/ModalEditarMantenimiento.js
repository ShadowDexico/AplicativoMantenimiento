import React, { useState } from "react";
import { actualizarMantenimiento } from "../services/api";
import "../assets/ModalEditarMantenimiento.css";
import { eliminarMantenimiento } from "../services/api";

const ModalEditarMantenimiento = ({ mantenimiento, onClose, onGuardar }) => {
  const formatFechaFromBackend = (fecha) => {
    if (!fecha) return "";
    return String(fecha).slice(0, 10);
  };

  const formatHoraFromBackend = (hora) => {
    if (!hora) return "";
    if (hora.includes("T")) {
      return hora.split("T")[1].slice(0, 5);
    }
    if (hora.includes(":")) {
      return hora.slice(0, 5);
    }
    return "";
  };

  const [form, setForm] = useState({
    tipo_mantenimiento: mantenimiento.tipo_mantenimiento || "",
    fecha_mantenimiento: formatFechaFromBackend(
      mantenimiento.fecha_mantenimiento
    ),
    hora_inicio: formatHoraFromBackend(mantenimiento.hora_inicio),
    hora_fin: formatHoraFromBackend(mantenimiento.hora_fin),
    observaciones: mantenimiento.observaciones || "",
    usuario_registro: mantenimiento.usuario_registro || "",
  });

  const [errores, setErrores] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (errores[name]) {
      setErrores({ ...errores, [name]: "" });
    }
  };

  const validar = () => {
    const nuevosErrores = {};
    if (!form.tipo_mantenimiento.trim())
      nuevosErrores.tipo_mantenimiento = "Requerido";
    if (!form.fecha_mantenimiento)
      nuevosErrores.fecha_mantenimiento = "Requerido";
    if (!form.hora_inicio) nuevosErrores.hora_inicio = "Requerido";
    if (!form.hora_fin) nuevosErrores.hora_fin = "Requerido";
    if (!form.usuario_registro.trim())
      nuevosErrores.usuario_registro = "Requerido";
    if (form.hora_inicio && form.hora_fin) {
      if (form.hora_fin <= form.hora_inicio) {
        nuevosErrores.hora_fin = "La hora fin debe ser mayor a la hora inicio";
      }
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validar()) return;
    const formatearHoraParaBackend = (hora) => {
      if (!hora) return null;
      if (hora.split(":").length === 3) {
        return hora;
      }
      if (hora.split(":").length === 2) {
        return `${hora}:00`;
      }
      return null;
    };

    const datos = {
      ...form,
      hora_inicio: formatearHoraParaBackend(form.hora_inicio),
      hora_fin: formatearHoraParaBackend(form.hora_fin),
    };

    try {
      await actualizarMantenimiento(mantenimiento.id, datos);
      onGuardar();
    } catch (err) {
      console.error("Error al actualizar mantenimiento:", err);
      alert(
        "Error al actualizar mantenimiento. Verifica la consola para más detalles."
      );
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>✏️ Editar Mantenimiento</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            {/* Tipo de mantenimiento */}
            <div className="form-group">
              <label>Tipo de mantenimiento:</label>
              <select
                name="tipo_mantenimiento"
                value={form.tipo_mantenimiento}
                onChange={handleChange}
                className={errores.tipo_mantenimiento ? "input-error" : ""}
              >
                <option value="">Seleccionar tipo</option>
                <option value="Preventivo">Preventivo</option>
                <option value="Correctivo">Correctivo</option>
                <option value="Predictivo">Predictivo</option>
                <option value="Instalación de software">
                  Instalación de software
                </option>
                <option value="Actualización de hardware">
                  Actualización de hardware
                </option>
                <option value="Limpieza física">Limpieza física</option>
                <option value="Copia de seguridad">Copia de seguridad</option>
              </select>
              {errores.tipo_mantenimiento && (
                <span className="error-message">
                  {errores.tipo_mantenimiento}
                </span>
              )}
            </div>
          </div>
          <div className="form-group">
            <label>Fecha:</label>
            <input
              type="date"
              name="fecha_mantenimiento"
              value={form.fecha_mantenimiento}
              onChange={handleChange}
            />
            {errores.fecha_mantenimiento && (
              <span className="error-message">
                {errores.fecha_mantenimiento}
              </span>
            )}
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Hora inicio:</label>
              <input
                type="time"
                name="hora_inicio"
                value={form.hora_inicio}
                onChange={handleChange}
                step="60"
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
                value={form.hora_fin}
                onChange={handleChange}
                step="60"
              />
              {errores.hora_fin && (
                <span className="error-message">{errores.hora_fin}</span>
              )}
            </div>
          </div>
          <div className="form-group">
            <label>Observaciones:</label>
            <textarea
              name="observaciones"
              value={form.observaciones}
              onChange={handleChange}
              rows="3"
            />
          </div>
          <div className="form-group">
            <label>Registrado por:</label>
            <input
              name="usuario_registro"
              value={form.usuario_registro}
              onChange={handleChange}
            />
            {errores.usuario_registro && (
              <span className="error-message">{errores.usuario_registro}</span>
            )}
          </div>
          <div className="modal-actions">
            <button type="submit" className="btn-primary">
              Guardar
            </button>
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancelar
            </button>
          </div>
          <div className="modal-actions" style={{ marginTop: "20px" }}>
            <button
              type="button"
              className="btn-danger"
              onClick={async () => {
                if (!window.confirm("¿Eliminar este mantenimiento?")) return;
                try {
                  await eliminarMantenimiento(mantenimiento.id);
                  alert("Eliminado correctamente");
                  onGuardar();
                } catch (err) {
                  alert("Error al eliminar");
                }
              }}
            >
              🗑️ Eliminar Mantenimiento
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalEditarMantenimiento;
