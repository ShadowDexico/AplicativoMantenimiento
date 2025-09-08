import "../assets/ListaEquipos.css";
import React, { useEffect, useState, useCallback } from "react";
import { getEquipos } from "../services/api";

const ListaEquipos = ({ onSelect }) => {
  const [equipos, setEquipos] = useState([]);
  const [busqueda, setBusqueda] = useState("");

  const cargarEquipos = useCallback(async () => {
    try {
      const res = await getEquipos();
      setEquipos(res.data);
    } catch (err) {
      console.error("Error al cargar equipos:", err);
    }
  }, []);

  useEffect(() => {
    cargarEquipos();

    const intervalId = setInterval(
      cargarEquipos,
      equipos.length > 0 ? 60000 : 3000
    );

    return () => clearInterval(intervalId);
  }, [cargarEquipos, equipos.length]);

  const equiposFiltrados = equipos.filter(
    (eq) =>
      (eq.tipo_equipo?.toLowerCase() || "").includes(busqueda.toLowerCase()) ||
      (eq.marca?.toLowerCase() || "").includes(busqueda.toLowerCase()) ||
      (eq.modelo?.toLowerCase() || "").includes(busqueda.toLowerCase()) ||
      (eq.usuario_asignado?.toLowerCase() || "").includes(
        busqueda.toLowerCase()
      ) ||
      (eq.serie?.toLowerCase() || "").includes(busqueda.toLowerCase()) ||
      (eq.ubicacion?.toLowerCase() || "").includes(busqueda.toLowerCase()) ||
      (eq.activo_institucional?.toLowerCase() || "").includes(
        busqueda.toLowerCase()
      )
  );

  return (
    <div>
      <h3>Equipos Registrados</h3>

      {/* 🔍 Barra de búsqueda con onChange */}
      <div
        className="search-container"
        style={{ textAlign: "center", marginBottom: "20px" }}
      >
        <input
          type="text"
          placeholder="Buscar en columna..."
          value={busqueda}
          onChange={(e) => {
            setBusqueda(e.target.value); // onChange actualiza el estado en tiempo real
          }}
        />
      </div>
      <div className="table-container">
        <table border="1" cellPadding="8">
          <thead>
            <tr>
              <th>Tipo</th>
              <th>Marca</th>
              <th>Modelo</th>
              <th>Responsable</th>
              <th>Ubicación</th>
              <th>Estado</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {equiposFiltrados.length > 0 ? (
              equiposFiltrados.map((eq) => {
                return (
                  <tr key={eq.id}>
                    <td>{eq.tipo_equipo}</td>
                    <td>{eq.marca}</td>
                    <td>{eq.modelo}</td>
                    <td>{eq.usuario_asignado}</td>
                    <td>{eq.ubicacion}</td>
                    <td>
                      {eq.estado === 1 ||
                      eq.estado === true ||
                      eq.estado === "1"
                        ? "✅ Activo"
                        : eq.estado === 0 ||
                          eq.estado === false ||
                          eq.estado === "0"
                        ? "🛑 Inactivo"
                        : "🚫 Dado de baja"}
                    </td>
                    <td>
                      <button
                        className="buttomListaEquipo"
                        onClick={() => onSelect(eq)}
                      >
                        Ver
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: "center" }}>
                  No hay equipos registrados
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListaEquipos;
