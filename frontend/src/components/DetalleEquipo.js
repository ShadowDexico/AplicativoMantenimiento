import "../assets/DetalleEquipo.css";
import React, { useState, useEffect } from "react";
import ModalMantenimiento from "./ModalMantenimiento";
import { getMantenimientosPorEquipo } from "../services/api";
import { darDeBajaEquipo } from "../services/api";
import ModalEditarMantenimiento from "./ModalEditarMantenimiento";
import { actualizarEquipo } from "../services/api";

const DetalleEquipo = ({ equipo, onVolver, onActualizar }) => {
  const [editando, setEditando] = useState(false);
  const [equipoEdit, setEquipoEdit] = useState({ ...equipo });
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mantenimientos, setMantenimientos] = useState([]);
  const [mantenimientoEdit, setMantenimientoEdit] = useState(null);
  const [firmaSeleccionada, setFirmaSeleccionada] = useState(null);
  const [mostrarModalFirma, setMostrarModalFirma] = useState(false);

  useEffect(() => {
    setEquipoEdit({
      ...equipo,
      ipActiva: equipo.ipActiva === 1 || equipo.ipActiva === true,
      estado: equipo.estado === 1 || equipo.estado === true,
    });
  }, [equipo]);

  useEffect(() => {
    const cargar = async () => {
      if (!equipo.id) return;
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
    cargar();
  }, [equipo.id]);

  const handleActualizar = () => {
    setEditando(true);
  };

  const handleGuardar = async () => {
    const data = {
      ...equipoEdit,
      ipActiva: equipoEdit.ipActiva ? 1 : 0,
      estado: equipoEdit.estado ? 1 : 0,
      fecha_compra: equipoEdit.fecha_compra?.split("T")[0] || null,
      fecha_instalacion: equipoEdit.fecha_instalacion?.split("T")[0] || null,
      marca: equipoEdit.marca || "",
      modelo: equipoEdit.modelo || "",
      tipo_equipo: equipoEdit.tipo_equipo || "",
      serie: equipoEdit.serie || "",
      disco: equipoEdit.disco || "",
      ram: equipoEdit.ram || "",
      procesador: equipoEdit.procesador || "",
      sistema_operativo: equipoEdit.sistema_operativo || "",
      activo_institucional: equipoEdit.activo_institucional || "",
      usuario_asignado: equipoEdit.usuario_asignado || "",
      ubicacion: equipoEdit.ubicacion || "",
      nombre_dispositivo: equipoEdit.nombre_dispositivo || "",
      ip: equipoEdit.ipActiva ? equipoEdit.ip || "" : null,
    };

    console.log("📤 Enviando al backend:", data);

    try {
      // Llama al API para guardar
      await actualizarEquipo(equipo.id, data);

      // Notifica al padre (App.js) para actualizar listas
      if (typeof onActualizar === "function") {
        onActualizar(equipo.id, data);
      }

      setEditando(false);
      alert("✅ Equipo actualizado correctamente");
    } catch (err) {
      console.error("Error al guardar:", err);
      alert("No se pudo actualizar el equipo. Revisa conexión o datos.");
    }
  };

  const handleBaja = () => {
    const usuarioBaja = prompt("¿Quién da de baja el equipo?");
    if (usuarioBaja) {
      darDeBajaEquipo(equipo.id, { usuarioBaja })
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
          <div style={{ marginTop: "20px" }}>
            <div
              className="form-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "12px",
              }}
            >
              <div>
                <label>Tipo de equipo:</label>
                <input
                  name="tipo_equipo"
                  value={equipoEdit.tipo_equipo || ""}
                  onChange={(e) =>
                    setEquipoEdit({
                      ...equipoEdit,
                      tipo_equipo: e.target.value,
                    })
                  }
                  style={{ width: "100%" }}
                />
              </div>
              <div>
                <label>Marca:</label>
                <input
                  name="marca"
                  value={equipoEdit.marca || ""}
                  onChange={(e) =>
                    setEquipoEdit({ ...equipoEdit, marca: e.target.value })
                  }
                  style={{ width: "100%" }}
                />
              </div>
              <div>
                <label>Modelo:</label>
                <input
                  name="modelo"
                  value={equipoEdit.modelo || ""}
                  onChange={(e) =>
                    setEquipoEdit({ ...equipoEdit, modelo: e.target.value })
                  }
                  style={{ width: "100%" }}
                />
              </div>
              <div>
                <label>Serie:</label>
                <input
                  name="serie"
                  value={equipoEdit.serie || ""}
                  onChange={(e) =>
                    setEquipoEdit({ ...equipoEdit, serie: e.target.value })
                  }
                  style={{ width: "100%" }}
                />
              </div>
              <div>
                <label>Activo Institucional:</label>
                <input
                  name="activo_institucional"
                  value={equipoEdit.activo_institucional || ""}
                  onChange={(e) =>
                    setEquipoEdit({
                      ...equipoEdit,
                      activo_institucional: e.target.value,
                    })
                  }
                  style={{ width: "100%" }}
                />
              </div>
              <div>
                <label>Usuario asignado:</label>
                <input
                  name="usuario_asignado"
                  value={equipoEdit.usuario_asignado || ""}
                  onChange={(e) =>
                    setEquipoEdit({
                      ...equipoEdit,
                      usuario_asignado: e.target.value,
                    })
                  }
                  style={{ width: "100%" }}
                />
              </div>
              <div>
                <label>Ubicación:</label>
                <input
                  name="ubicacion"
                  value={equipoEdit.ubicacion || ""}
                  onChange={(e) =>
                    setEquipoEdit({ ...equipoEdit, ubicacion: e.target.value })
                  }
                  style={{ width: "100%" }}
                />
              </div>
              <div>
                <label>Sistema Operativo:</label>
                <input
                  name="sistema_operativo"
                  value={equipoEdit.sistema_operativo || ""}
                  onChange={(e) =>
                    setEquipoEdit({
                      ...equipoEdit,
                      sistema_operativo: e.target.value,
                    })
                  }
                  style={{ width: "100%" }}
                />
              </div>
              <div>
                <label>Procesador:</label>
                <input
                  name="procesador"
                  value={equipoEdit.procesador || ""}
                  onChange={(e) =>
                    setEquipoEdit({ ...equipoEdit, procesador: e.target.value })
                  }
                  style={{ width: "100%" }}
                />
              </div>
              <div>
                <label>RAM:</label>
                <input
                  name="ram"
                  value={equipoEdit.ram || ""}
                  onChange={(e) =>
                    setEquipoEdit({ ...equipoEdit, ram: e.target.value })
                  }
                  style={{ width: "100%" }}
                />
              </div>
              <div>
                <label>Disco:</label>
                <input
                  name="disco"
                  value={equipoEdit.disco || ""}
                  onChange={(e) =>
                    setEquipoEdit({ ...equipoEdit, disco: e.target.value })
                  }
                  style={{ width: "100%" }}
                />
              </div>
              <div>
                <label>Fecha de compra:</label>
                <input
                  type="date"
                  name="fecha_compra"
                  value={equipoEdit.fecha_compra?.split("T")[0]}
                  onChange={(e) =>
                    setEquipoEdit({
                      ...equipoEdit,
                      fecha_compra: e.target.value,
                    })
                  }
                  style={{ width: "100%" }}
                />
              </div>
              <div>
                <label>Nombre del dispositivo:</label>
                <input
                  name="nombre_dispositivo"
                  value={equipoEdit.nombre_dispositivo || ""}
                  onChange={(e) =>
                    setEquipoEdit({
                      ...equipoEdit,
                      nombre_dispositivo: e.target.value,
                    })
                  }
                  style={{ width: "100%" }}
                />
              </div>
              <div>
                <label>Fecha de instalación:</label>
                <input
                  type="date"
                  name="fecha_instalacion"
                  value={equipoEdit.fecha_instalacion?.split("T")[0]}
                  onChange={(e) =>
                    setEquipoEdit({
                      ...equipoEdit,
                      fecha_instalacion: e.target.value,
                    })
                  }
                  style={{ width: "100%" }}
                />
              </div>
              <div>
                <label>¿Tiene IP?</label>
                <div className="radio-group">
                  <label>
                    <input
                      type="radio"
                      name="ipActiva"
                      checked={equipoEdit.ipActiva}
                      onChange={() =>
                        setEquipoEdit({ ...equipoEdit, ipActiva: true })
                      }
                    />
                    Sí
                  </label>
                  <label style={{ marginLeft: "16px" }}>
                    <input
                      type="radio"
                      name="ipActiva"
                      checked={!equipoEdit.ipActiva}
                      onChange={() =>
                        setEquipoEdit({ ...equipoEdit, ipActiva: false })
                      }
                    />
                    No
                  </label>
                </div>
              </div>
              {equipoEdit.ipActiva && (
                <div>
                  <label>Dirección IP:</label>
                  <input
                    type="text"
                    name="ip"
                    value={equipoEdit.ip || ""}
                    onChange={(e) =>
                      setEquipoEdit({ ...equipoEdit, ip: e.target.value })
                    }
                    style={{ width: "100%" }}
                  />
                </div>
              )}
              <div>
                <label>Estado:</label>
                <div className="radio-group">
                  <label>
                    <input
                      type="radio"
                      name="estado"
                      checked={
                        equipoEdit.estado === 1 || equipoEdit.estado === true
                      }
                      onChange={() =>
                        setEquipoEdit({ ...equipoEdit, estado: 1 })
                      }
                    />
                    Activo
                  </label>
                  <label style={{ marginLeft: "16px" }}>
                    <input
                      type="radio"
                      name="estado"
                      checked={
                        equipoEdit.estado === 0 || equipoEdit.estado === false
                      }
                      onChange={() =>
                        setEquipoEdit({ ...equipoEdit, estado: 0 })
                      }
                    />
                    Inactivo
                  </label>
                </div>
              </div>
            </div>

            <div style={{ marginTop: "20px" }}>
              <button className="buttomDetalleEquipo" onClick={handleGuardar}>
                Guardar Cambios
              </button>
              <button
                className="buttomDetalleEquipo"
                onClick={() => setEditando(false)}
                style={{ marginLeft: "10px" }}
              >
                Cancelar
              </button>
            </div>
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
                  <th>Acciones</th>
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
                    <td>
                      {/* Botón Editar */}
                      <button
                        className="buttomListaEquipo"
                        onClick={() => setMantenimientoEdit(m)}
                        title="Editar mantenimiento"
                        style={{ marginRight: "8px" }}
                      >
                        📝
                      </button>

                      {/* Botón Ver Firma */}
                      {m.firma ? (
                        <button
                          className="buttomListaEquipo"
                          onClick={() => {
                            const backendHost = "10.20.1.142";
                            console.log(m.firma.split('firma/')[1]);
                            setFirmaSeleccionada(
                              `http://${backendHost}:3150/${m.firma.split('firma/')[1]}`
                            );
                            setMostrarModalFirma(true);
                          }}
                          title="Ver firma"
                        >
                          👁️
                        </button>
                      ) : (
                        <span style={{ color: "#999", fontSize: "0.9rem" }}>
                          Sin firma
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        {/* Modal de edición */}
        {mantenimientoEdit && (
          <ModalEditarMantenimiento
            mantenimiento={mantenimientoEdit}
            onClose={() => setMantenimientoEdit(null)}
            onGuardar={async () => {
              try {
                const res = await getMantenimientosPorEquipo(equipo.id);
                setMantenimientos(res.data);
                setMantenimientoEdit(null);
              } catch (err) {
                alert("Error al refrescar");
              }
            }}
          />
        )}
      </div>
      {mostrarModalFirma && firmaSeleccionada && (
        <div
          className="modal-backdrop"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 10000,
          }}
          onClick={() => setMostrarModalFirma(false)}
        >
          <div
            style={{
              background: "white",
              borderRadius: "12px",
              padding: "20px",
              maxWidth: "90vw",
              maxHeight: "90vh",
              overflow: "auto",
              position: "relative",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h4 style={{ margin: "0 0 16px 0", textAlign: "center" }}>
              Firma del responsable
            </h4>
            <img
              src={firmaSeleccionada}
              alt="Firma del mantenimiento"
              style={{
                maxWidth: "100%",
                maxHeight: "70vh",
                objectFit: "contain",
                border: "1px solid #ddd",
                borderRadius: "8px",
              }}
              onError={(e) => {
                console.error("❌ No se pudo cargar la firma:", e.target.src);
                e.target.style.backgroundColor = "#f9f9f9";
                e.target.style.width = "300px";
                e.target.style.height = "150px";
                e.target.style.display = "flex";
                e.target.style.alignItems = "center";
                e.target.style.justifyContent = "center";
                e.target.style.color = "#666";
                e.target.src = ""; // Evita imagen rota
                e.target.alt = "No se pudo cargar la firma";
              }}
            />
            <button
              onClick={() => setMostrarModalFirma(false)}
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                background: "#ccc",
                border: "none",
                borderRadius: "50%",
                width: "30px",
                height: "30px",
                cursor: "pointer",
                fontSize: "18px",
              }}
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DetalleEquipo;
