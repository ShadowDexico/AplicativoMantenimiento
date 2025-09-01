import "../assets/DetalleEquipo.css";
import React, { useState } from "react";
import ModalMantenimiento from "./ModalMantenimiento";
import { darDeBajaEquipo } from "../services/api";

const DetalleEquipo = ({ equipo, onVolver, onActualizar }) => {
  const [editando, setEditando] = useState(false);
  const [equipoEdit, setEquipoEdit] = useState({ ...equipo });
  const [showModal, setShowModal] = useState(false);

  const handleActualizar = () => {
    setEditando(true);
  };

  const handleGuardar = async () => {
    try {
      await onActualizar(equipo.id, equipoEdit);
      setEditando(false);
      alert("Equipo actualizado");
    } catch (err) {
      alert("Error");
    }
  };

  const handleBaja = () => {
    const usuarioBaja = prompt("¿Quién da de baja el equipo?");
    if (usuarioBaja) {
      darDeBajaEquipo(equipo.id, { usuarioBaja }) // ← clave: nombre correcto
        .then(() => {
          alert("Equipo dado de baja");
          onVolver();
        })
        .catch((err) => {
          console.error("Error al dar de baja:", err);
          alert("Error al dar de baja");
        });
    }
  };

  return (
    <div className="detalle-container">
      <div>
        <h3>Detalles del Equipo</h3>
        {editando ? (
          <div>
            <input
              name="marca"
              value={equipoEdit.marca}
              onChange={(e) =>
                setEquipoEdit({ ...equipoEdit, marca: e.target.value })
              }
            />
            <input
              name="modelo"
              value={equipoEdit.modelo}
              onChange={(e) =>
                setEquipoEdit({ ...equipoEdit, modelo: e.target.value })
              }
            />
            <button className="buttomDetalleEquipo" onClick={handleGuardar}>
              Guardar
            </button>
            <button
              className="buttomDetalleEquipo"
              onClick={() => setEditando(false)}
            >
              Cancelar
            </button>
          </div>
        ) : (
          <div>
            <p>
              <strong>Tipo:</strong> {equipo.tipo_equipo}
            </p>
            <p>
              <strong>Marca:</strong> {equipo.marca}
            </p>
            <p>
              <strong>Modelo:</strong> {equipo.modelo}
            </p>
            <p>
              <strong>Usuario:</strong> {equipo.usuario_asignado}
            </p>
            <p>
              <strong>Estado:</strong>{" "}
              {equipo.estado === 1 ||
              equipo.estado === true ||
              equipo.estado === "1"
                ? "✅ Activo"
                : equipo.estado === 0 ||
                  equipo.estado === false ||
                  equipo.estado === "0"
                ? "🛑 Inactivo"
                : "🚫 Dado de baja"}
            </p>

            <button
              className="buttomDetalleEquipo"
              onClick={() => setShowModal(true)}
            >
              ➕ Mantenimiento
            </button>

            {/* Mostrar botón "Dar de baja" solo si está activo */}
            {equipo.estado !== null && (
              <button className="buttomDetalleEquipo" onClick={handleBaja}>
                🗑️ Dar de baja
              </button>
            )}
            <button className="buttomDetalleEquipo" onClick={handleActualizar}>
              ✏️ Editar
            </button>
            <button className="buttomDetalleEquipo" onClick={onVolver}>
              ← Volver
            </button>
          </div>
        )}

        {equipo.mantenimientos && equipo.mantenimientos.length > 0 && (
          <div>
            <h4>Mantenimientos</h4>
            <ul>
              {equipo.mantenimientos.map((m) => (
                <li key={m.id}>
                  {m.tipoMantenimiento} - {m.fechaMantenimiento} ({m.horaInicio}{" "}
                  a {m.horaFin})
                </li>
              ))}
            </ul>
          </div>
        )}

        {showModal && (
          <ModalMantenimiento
            equipoId={equipo.id}
            onClose={() => setShowModal(false)}
            onGuardar={() => {
              alert("Mantenimiento agregado");
              // Recargar detalle
            }}
          />
        )}
      </div>
    </div>
  );
};

export default DetalleEquipo;
