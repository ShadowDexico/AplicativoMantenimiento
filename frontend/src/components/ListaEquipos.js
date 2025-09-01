import "../assets/ListaEquipos.css";
import React, { useEffect, useState } from "react";
import { getEquipos } from "../services/api";

const ListaEquipos = ({ onSelect }) => {
  const [equipos, setEquipos] = useState([]);

  const cargarEquipos = async () => {
    try {
      const res = await getEquipos();
      setEquipos(res.data);
    } catch (err) {
      alert("Error al cargar equipos");
    }
  };

  useEffect(() => {
    const intervalId = setInterval(
      cargarEquipos,
      equipos?.length > 0 ? 60000 : 100
    );

    return () => clearInterval(intervalId);
  }, [cargarEquipos, equipos]);


  return (
    <div>
      <h3>Equipos Registrados</h3>
      <div className="table-container">
        <table border="1" cellPadding="8">
          <thead>
            <tr>
              <th>Tipo</th>
              <th>Marca</th>
              <th>Modelo</th>
              <th>Usuario</th>
              <th>Estado</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {equipos.map((eq) => {
              return (
                <tr key={eq.id}>
                  <td>{eq.tipo_equipo}</td>
                  <td>{eq.marca}</td>
                  <td>{eq.modelo}</td>
                  <td>{eq.usuario_asignado}</td>
                  <td>
                    {eq.estado == 1 || eq.estado === true || eq.estado === "1"
                      ? "✅ Activo"
                      : "🛑 Inactivo"}
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
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListaEquipos;
