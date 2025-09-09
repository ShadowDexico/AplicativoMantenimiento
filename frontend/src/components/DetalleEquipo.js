import "../assets/DetalleEquipo.css";
import React, { useState, useEffect } from "react";
import ModalMantenimiento from "./ModalMantenimiento";
import { getMantenimientosPorEquipo } from "../services/api";
import { darDeBajaEquipo } from "../services/api";

const DetalleEquipo = ({ equipo, onVolver, onActualizar }) => {
  const [editando, setEditando] = useState(false);
  const [equipoEdit, setEquipoEdit] = useState({ ...equipo });
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mantenimientos, setMantenimientos] = useState([]);

  useEffect(() => {
    const cargar = async () => {
      setLoading(true);
      try {
        const res = await getMantenimientosPorEquipo(equipo.id);
        setMantenimientos(res.data);
      } catch (err) {
        alert("Error al cargar el historial de mantenimientos");
      } finally {
        setLoading(false);
      }
    };

    if (equipo.id) {
      cargar();
    }
  }, [equipo.id]);

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

        {showModal && (
          <ModalMantenimiento
            equipoId={equipo.id}
            onClose={() => setShowModal(false)}
            onGuardar={async () => {
              try {
                const res = await getMantenimientosPorEquipo(equipo.id);
                setMantenimientos(res.data);
                alert("Mantenimiento agregado y listado actualizado");
              } catch (err) {
                alert("Error al cargar el historial actualizado");
              } finally {
                setShowModal(false);
              }
            }}
          />
        )}
        {/* Historial de mantenimientos */}
        <div className="historial-mantenimientos">
          <h4 className="titulo-historial">📋 Historial de Mantenimientos</h4>
          {loading ? (
            <p className="mensaje-info">Cargando mantenimientos...</p>
          ) : mantenimientos.length === 0 ? (
            <p className="mensaje-info">
              No se han registrado mantenimientos para este equipo.
            </p>
          ) : (
            <table className="tabla-mantenimientos">
              <thead>
                <tr>
                  <th>Tipo</th>
                  <th>Fecha</th>
                  <th>Hora</th>
                  <th>Observaciones</th>
                  <th>Registrado por</th>
                  <th>Fecha registro</th>
                </tr>
              </thead>
              <tbody>
                {mantenimientos.map((m) => (
                  <tr key={m.id}>
                    <td>{m.tipo_mantenimiento}</td>
                    <td>
                      {new Date(m.fecha_mantenimiento).toLocaleDateString()}
                    </td>
                    <td>
                      {m.hora_inicio.split("T")[1].slice(0, 5)} -{" "}
                      {m.hora_fin.split("T")[1].slice(0, 5)}
                    </td>
                    <td>{m.observaciones || "-"}</td>
                    <td>{m.usuario_registro}</td>
                    <td>{new Date(m.fecha_registro).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetalleEquipo;
