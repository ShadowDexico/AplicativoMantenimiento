import React, { useState } from 'react';
import FormularioEquipo from './components/FormularioEquipo';
import ListaEquipos from './components/ListaEquipos';
import DetalleEquipo from './components/DetalleEquipo';

function App() {
  const [equipos, setEquipos] = useState([]);
  const [detalle, setDetalle] = useState(null);

  const handleGuardar = (nuevo) => {
    setEquipos([...equipos, nuevo]);
  };

  const handleActualizar = (id, data) => {
    setEquipos(equipos.map(eq => eq.id === id ? { ...eq, ...data } : eq));
    setDetalle({ ...detalle, ...data });
  };

  const handleSelect = (eq) => {
    setDetalle(eq);
  };

  const handleVolver = () => {
    setDetalle(null);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>Inventario de Equipos</h1>

      {!detalle ? (
        <>
          <FormularioEquipo onGuardar={handleGuardar} />
          <ListaEquipos onSelect={handleSelect} />
        </>
      ) : (
        <DetalleEquipo
          equipo={detalle}
          onVolver={handleVolver}
          onActualizar={handleActualizar}
        />
      )}
    </div>
  );
}

export default App;