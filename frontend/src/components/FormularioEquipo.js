import React, { useState } from "react";
import "../assets/FormularioEquipo.css";
import { crearEquipo } from "../services/api";

const FormularioEquipo = ({ onGuardar }) => {
  const [equipo, setEquipo] = useState({
    tipo_equipo: "",
    marca: "",
    modelo: "",
    serie: "",
    activo_institucional: "",
    usuario_asignado: "",
    ubicacion: "",
    sistema_operativo: "",
    procesador: "",
    ram: "",
    disco: "",
    fecha_compra: "",
    nombre_dispositivo: "",
    fecha_instalacion: "",
    ipActiva: "no",
    ip: "",
    tipo_mantenimiento: "",
    fecha_mantenimiento: "",
    hora_inici: "",
    hora_fin: "",
    estado: true,
  });

  const [openDropdown, setOpenDropdown] = useState(null);
  const [otherTipo, setOtherTipo] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEquipo({ ...equipo, [name]: value });
  };

  const handleSelectTipo = (value) => {
    setEquipo({ ...equipo, tipo_equipo: value });
    setOpenDropdown(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const equipoParaEnviar = {
      ...equipo,
      estado: equipo.estado ? 1 : 0,
    };
    try {
      const res = await crearEquipo(equipoParaEnviar);
      onGuardar(res.data);
      alert("Equipo guardado");
      // reset
      setEquipo({
        tipo_equipo: "",
        marca: "",
        modelo: "",
        serie: "",
        activo_institucional: "",
        usuario_asignado: "",
        ubicacion: "",
        sistema_operativo: "",
        procesador: "",
        ram: "",
        disco: "",
        fecha_compra: "",
        nombre_dispositivo: "",
        fecha_instalacion: "",
        ipActiva: false,
        ip: null,
        tipo_mantenimiento: "",
        fecha_mantenimiento: "",
        hora_inici: "",
        hora_fin: "",
        estado: true,
      });
      setOtherTipo("");
    } catch (err) {
      alert("Error al guardar");
    }
  };

  const [openAccordion, setOpenAccordion] = useState(false);
  return (
    <div className="form-container">
      <h3>Registrar Nuevo Equipo</h3>
      <form onSubmit={handleSubmit}>
        <div className="accordion">
          <div
            className="accordion-header"
            onClick={() => setOpenAccordion(!openAccordion)}
          >
            <h4>Detalles del equipo</h4>
            <span className="accordion-arrow">{openAccordion ? "−" : "+"}</span>
          </div>

          {openAccordion && (
            <div className="accordion-body">
              <div className="form-grid">
                <div>
                  <label>Tipo de equipo:</label>
                  <div
                    className="dropdown-simulated-input"
                    onClick={() =>
                      setOpenDropdown(openDropdown === "tipo" ? null : "tipo")
                    }
                  >
                    <span className="dropdown-value">
                      {equipo.tipo_equipo || "Seleccionar tipo de equipo"}
                    </span>
                    <span className="dropdown-arrow">
                      {openDropdown === "tipo" ? "▲" : "▼"}
                    </span>
                  </div>

                  {openDropdown === "tipo" && (
                    <div className="dropdown-list-aligned">
                      {["Computadora", "Impresora", "Servidor", "Notebook"].map(
                        (tipo) => (
                          <div
                            key={tipo}
                            className="dropdown-item"
                            onClick={() => handleSelectTipo(tipo)}
                          >
                            {tipo}
                          </div>
                        )
                      )}
                      <div
                        className="dropdown-item"
                        onClick={() => {
                          setOpenDropdown("otroTipoInput");
                          setEquipo({ ...equipo, tipo_equipo: "Otro" });
                        }}
                      >
                        Otro...
                      </div>
                    </div>
                  )}
                </div>

                {equipo.tipo_equipo === "Otro" && (
                  <div className="form-group">
                    <label>Especificar tipo:</label>
                    <input
                      type="text"
                      placeholder="Ej. Proyector, Escáner"
                      value={otherTipo}
                      onChange={(e) => setOtherTipo(e.target.value)}
                      onBlur={() =>
                        setEquipo({ ...equipo, tipo_equipo: otherTipo })
                      }
                      autoFocus
                    />
                  </div>
                )}

                <div>
                  <label>Marca:</label>
                  <input
                    name="marca"
                    value={equipo.marca}
                    onChange={handleChange}
                    required
                    placeholder="HP, ACER, ..."
                  />
                </div>
                <div>
                  <label>Modelo:</label>
                  <input
                    name="modelo"
                    value={equipo.modelo}
                    onChange={handleChange}
                    required
                    placeholder="Inspiron 3501, ..."
                  />
                </div>

                <div>
                  <label>N° Serie:</label>
                  <input
                    name="serie"
                    value={equipo.serie}
                    onChange={handleChange}
                    required
                    placeholder="ABC123XYZ"
                  />
                </div>
                <div>
                  <label>Activo Institucional:</label>
                  <input
                    name="activo_institucional"
                    value={equipo.activo_institucional}
                    onChange={handleChange}
                    placeholder="SM-XXXX"
                  />
                </div>

                <div>
                  <label>Usuario:</label>
                  <input
                    name="usuario_asignado"
                    value={equipo.usuario_asignado}
                    onChange={handleChange}
                    placeholder="Nombre completo"
                  />
                </div>

                <div>
                  <label>Ubicación:</label>
                  <input
                    name="ubicacion"
                    value={equipo.ubicacion}
                    onChange={handleChange}
                    placeholder="URGENCIA, ADMISIONES, ..."
                  />
                </div>
                <div>
                  <label>S.O.:</label>
                  <input
                    name="sistema_operativo"
                    value={equipo.sistema_operativo}
                    onChange={handleChange}
                    placeholder="Windows 10, macOS, etc."
                  />
                </div>
                <div>
                  <label>Procesador:</label>
                  <input
                    name="procesador"
                    value={equipo.procesador}
                    onChange={handleChange}
                    placeholder="Intel i5-10400, ..."
                  />
                </div>
                <div>
                  <label>RAM:</label>
                  <input
                    name="ram"
                    value={equipo.ram}
                    onChange={handleChange}
                    placeholder="8 GB, 16 GB, ..."
                  />
                </div>
                <div>
                  <label>Disco:</label>
                  <input
                    name="disco"
                    value={equipo.disco}
                    onChange={handleChange}
                    placeholder="256 GB SSD, 1 TB HDD, ..."
                  />
                </div>

                <div>
                  <label>Fecha de compra:</label>
                  <input
                    type="date"
                    name="fecha_compra"
                    value={equipo.fecha_compra}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label>Nombre del dispositivo:</label>
                  <input
                    name="nombre_dispositivo"
                    value={equipo.nombre_dispositivo}
                    onChange={handleChange}
                    placeholder="PC-Servicios, ..."
                  />
                </div>

                <div>
                  <label>Fecha de instalación:</label>
                  <input
                    type="date"
                    name="fecha_instalacion"
                    value={equipo.fecha_instalacion}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label>¿Tiene IP?</label>
                  <div className="radio-group">
                    <label>
                      <input
                        type="radio"
                        name="ipActiva"
                        value="si"
                        checked={equipo.ipActiva}
                        onChange={() =>
                          setEquipo({ ...equipo, ipActiva: true })
                        }
                      />
                      Sí
                    </label>
                    <label style={{ marginLeft: "16px" }}>
                      <input
                        type="radio"
                        name="ipActiva"
                        value="no"
                        checked={!equipo.ipActiva}
                        onChange={() =>
                          setEquipo({ ...equipo, ipActiva: false, ip: null })
                        }
                      />
                      No
                    </label>
                  </div>
                </div>

                {/* Campo IP condicional */}
                {equipo.ipActiva && (
                  <div>
                    <label>Dirección IP:</label>
                    <input
                      type="text"
                      name="ip"
                      value={equipo.ip || ""}
                      onChange={(e) =>
                        setEquipo({ ...equipo, ip: e.target.value })
                      }
                      placeholder="192.168.1.100"
                      pattern="^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$"
                      title="Ingresa una IP válida (ej: 192.168.1.100)"
                    />
                  </div>
                )}

                <div>
                  <label>¿Equipo activo?</label>
                  <div className="radio-group">
                    <label>
                      <input
                        type="radio"
                        name="estado"
                        value="si"
                        checked={equipo.estado === true || equipo.estado === 1}
                        onChange={() => setEquipo({ ...equipo, estado: true })}
                      />
                      Sí
                    </label>
                    <label style={{ marginLeft: "16px" }}>
                      <input
                        type="radio"
                        name="estado"
                        value="no"
                        checked={equipo.estado === false || equipo.estado === 0}
                        onChange={() => setEquipo({ ...equipo, estado: false })}
                      />
                      No
                    </label>
                  </div>
                </div>

                <div></div>
              </div>
            </div>
          )}
        </div>

        <button type="submit">Guardar Equipo</button>
      </form>
    </div>
  );
};

export default FormularioEquipo;
