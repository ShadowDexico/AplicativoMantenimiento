import React, { useRef, useEffect, useState } from "react";
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
  const [isDrawing, setIsDrawing] = useState(false);
  const [mostrarFirmaFullscreen, setMostrarFirmaFullscreen] = useState(false);
  const [firmaHecha, setFirmaHecha] = useState(false);

  const canvasRef = useRef(null);
  const canvasStorageRef = useRef(null);

  useEffect(() => {
    const canvas = canvasStorageRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, 500, 150);
  }, []);

  useEffect(() => {
    if (mostrarFirmaFullscreen && canvasRef.current) {
      const canvas = canvasRef.current;
      const parent = canvas.parentElement;

      const resizeCanvas = () => {
        const w = parent.offsetWidth;
        const h = parent.offsetHeight;
        canvas.width = w;
        canvas.height = h;

        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        ctx.lineWidth = 2;
        ctx.lineCap = "round";
        ctx.strokeStyle = "#000";
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, w, h);
      };

      resizeCanvas();
      window.addEventListener("resize", resizeCanvas);

      return () => window.removeEventListener("resize", resizeCanvas);
    }
  }, [mostrarFirmaFullscreen]);

  const getCoordinates = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();

    let clientX, clientY;

    if (e.type.includes("touch")) {
      const touch = e.touches[0] || e.changedTouches[0];
      clientX = touch.clientX;
      clientY = touch.clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  };

  // Iniciar dibujo (mouse o touch)
  const iniciarDibujo = (e) => {
    // Prevenir comportamiento por defecto (scroll/zoom)
    if (e.type.includes("touch")) {
      e.preventDefault();
    }

    const { x, y } = getCoordinates(e);
    const ctx = canvasRef.current.getContext("2d");
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const dibujar = (e) => {
    if (!isDrawing) return;

    // Prevenir scroll en móvil
    if (e.type.includes("touch")) {
      e.preventDefault(); // ← Clave para evitar scroll
    }

    const { x, y } = getCoordinates(e);
    const ctx = canvasRef.current.getContext("2d");
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const detenerDibujo = () => {
    setIsDrawing(false);

    // Verificar si hay firma
    setTimeout(() => {
      if (!isCanvasEmpty()) {
        setFirmaHecha(true);
      }
    }, 100);
  };
  // Función para verificar si el canvas está vacío
  const isCanvasEmpty = () => {
    try {
      const canvas = canvasRef.current;
      if (!canvas) return true; // Si no hay canvas, está vacío

      const ctx = canvas.getContext("2d");
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

      // Verifica que imageData existe y tiene data
      if (!imageData || !imageData.data) return true;

      const buffer = new Uint32Array(imageData.data.buffer);
      return !buffer.some((color) => color !== 0xffffffff);
    } catch (error) {
      console.error("Error verificando canvas:", error);
      return true; // En caso de error, considera que está vacío
    }
  };

  const limpiarFirma = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const handleListo = () => {
    const canvasVisible = canvasRef.current;
    const canvasOculto = canvasStorageRef.current;

    if (canvasVisible && canvasOculto) {
      const ctx = canvasOculto.getContext("2d", { willReadFrequently: true });
      ctx.clearRect(0, 0, 500, 150);
      ctx.drawImage(canvasVisible, 0, 0, 500, 150);
    }

    setMostrarFirmaFullscreen(false);
    setFirmaHecha(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "fecha_mantenimiento") {
      setMantenimiento({ ...mantenimiento, [name]: value });
    } else {
      setMantenimiento({ ...mantenimiento, [name]: value });
    }
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
    try {
      const canvas = canvasStorageRef.current;
      if (!canvas) {
        alert("Error crítico: No se encontró el lienzo de firma.");
        return;
      }
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      const imageData = ctx.getImageData(
        0,
        0,
        canvas.width,
        canvas.height
      ).data;
      const isBlank = imageData.every((pixel) => pixel === 255);

      if (
        isBlank &&
        !window.confirm("La firma está vacía. ¿Continuar de todos modos?")
      ) {
        return;
      }

      const dataURL = canvas.toDataURL("image/jpeg", 0.8);
      const res = await fetch(dataURL);
      const blob = await res.blob();

      // Crear FormData
      const formData = new FormData();
      formData.append("equipoId", equipoId);
      formData.append("tipo_mantenimiento", mantenimiento.tipo_mantenimiento);
      formData.append("fecha_mantenimiento", mantenimiento.fecha_mantenimiento);
      formData.append("hora_inicio", mantenimiento.hora_inicio);
      formData.append("hora_fin", mantenimiento.hora_fin);
      formData.append("observaciones", mantenimiento.observaciones);
      formData.append("usuario_registro", mantenimiento.usuario_registro);

      // Nombre del archivo: fecha + milisegundos + _firma.jpg
      const fecha = new Date().toISOString().replace(/:/g, "-"); // Evita : en nombre
      const fileName = `${fecha}_firma.jpg`;
      formData.append("firma", blob, fileName);

      // Enviar al backend
      await agregarMantenimiento(formData); // Cambia api para aceptar FormData

      onGuardar();
      onClose();
    } catch (err) {
      console.error("Error al registrar mantenimiento:", err);
      alert("No se pudo guardar. Revisa conexión.");
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

          {/* Botón que abre la firma en pantalla completa */}
          <div className="form-group">
            <label>Firma del responsable:</label>
            <button
              type="button"
              onClick={() => setMostrarFirmaFullscreen(true)}
              className="btn-firma"
            >
              {firmaHecha ? "✏️ Editar firma" : "✍️ Tocar para firmar"}
            </button>
            {firmaHecha && (
              <p className="firma-completada">✔️ Firma completada</p>
            )}
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
          {/* Modal full screen para firma */}
          {mostrarFirmaFullscreen && (
            <div
              className="firma-fullscreen"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Encabezado */}
              <div className="firma-header">
                <h3>✍️ Firma digital</h3>
                <p>Dibuja tu firma con el dedo o mouse</p>
              </div>

              {/* Canvas */}
              <div
                style={{
                  flex: 1,
                  border: "2px solid #ddd",
                  borderRadius: "8px",
                  overflow: "hidden",
                  marginTop: "10px",
                  marginBottom: "10px",
                  minHeight: "200px" /* ← Clave */,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <canvas
                  ref={canvasRef}
                  style={{
                    background: "white",
                    display: "block",
                    width: "100%",
                    height: "100%",
                    touchAction: "none", // ← Clave para evitar scroll en touch
                  }}
                  onTouchStart={iniciarDibujo}
                  onTouchMove={dibujar}
                  onTouchEnd={detenerDibujo}
                  onMouseDown={iniciarDibujo}
                  onMouseMove={dibujar}
                  onMouseUp={detenerDibujo}
                  onMouseLeave={detenerDibujo}
                />
              </div>

              {/* Botones inferiores */}
              <div className="firma-actions">
                <button
                  type="button"
                  className="btn-limpiar"
                  onClick={limpiarFirma}
                >
                  🧽 Limpiar
                </button>
                <button
                  type="button"
                  onClick={handleListo}
                  className="btn-listo"
                >
                  ✅ Listo
                </button>
              </div>
            </div>
          )}
          <div style={{ position: "absolute", left: "-9999px" }}>
            <canvas ref={canvasStorageRef} width="500" height="150" />
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalMantenimiento;
