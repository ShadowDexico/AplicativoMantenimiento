import '../assets/ModalMantenimiento.css';
import React, { useState } from 'react';
import { agregarMantenimiento } from '../services/api';

const ModalMantenimiento = ({ equipoId, onClose, onGuardar }) => {
    const [mantenimiento, setMantenimiento] = useState({
        tipoMantenimiento: '',
        fechaMantenimiento: '',
        horaInicio: '',
        horaFin: '',
        observaciones: '',
    });

    const handleChange = (e) => {
        setMantenimiento({ ...mantenimiento, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await agregarMantenimiento(equipoId, mantenimiento);
            onGuardar();
            onClose();
        } catch (err) {
            alert('Error al registrar mantenimiento');
        }
    };

    return (
        <div className="modal-backdrop">
            <div className="modal-content">
                <h3>Agregar Mantenimiento</h3>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Tipo:</label>
                        <div>
                            <label><input type="checkbox" name="tipoMantenimiento" value="Preventivo" onChange={handleChange} /> Preventivo</label>
                            <label><input type="checkbox" name="tipoMantenimiento" value="Correctivo" onChange={handleChange} /> Correctivo</label>
                            <label><input type="checkbox" name="tipoMantenimiento" value="Actualización" onChange={handleChange} /> Actualización</label>
                            <label><input type="checkbox" name="tipoMantenimiento" value="Instalación de software" onChange={handleChange} /> Instalación SW</label>
                            <label><input type="checkbox" name="tipoMantenimiento" value="Limpieza física" onChange={handleChange} /> Limpieza física</label>
                            <input type="text" placeholder="Otro..." onChange={(e) => setMantenimiento({ ...mantenimiento, tipoMantenimiento: e.target.value })} />
                        </div>
                    </div>
                    <div><label>Fecha:</label><input type="date" name="fechaMantenimiento" onChange={handleChange} required /></div>
                    <div><label>Hora inicio:</label><input type="time" name="horaInicio" onChange={handleChange} /></div>
                    <div><label>Hora fin:</label><input type="time" name="horaFin" onChange={handleChange} /></div>
                    <div><label>Observaciones:</label><textarea name="observaciones" onChange={handleChange} /></div>
                    <button type="submit">Guardar</button>
                    <button type="button" onClick={onClose}>Cancelar</button>
                </form>
            </div>
        </div>
    );
};


export default ModalMantenimiento;