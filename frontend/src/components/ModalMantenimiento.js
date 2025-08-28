import React, { useState } from 'react';
import { agregarMantenimiento } from '../services/api';
import '../assets/ModalMantenimiento.css';

const ModalMantenimiento = ({ equipoId, onClose, onGuardar }) => {
    const [mantenimiento, setMantenimiento] = useState({
        tipoMantenimiento: '',
        fechaMantenimiento: '',
        horaInicio: '',
        horaFin: '',
        observaciones: '',
    });

    const [errores, setErrores] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setMantenimiento({ ...mantenimiento, [name]: value });
        // Limpiar error al escribir
        if (errores[name]) {
            setErrores({ ...errores, [name]: '' });
        }
    };

    const validar = () => {
        const nuevosErrores = {};
        if (!mantenimiento.tipoMantenimiento.trim())
            nuevosErrores.tipoMantenimiento = 'Debe seleccionar un tipo de mantenimiento';
        if (!mantenimiento.fechaMantenimiento)
            nuevosErrores.fechaMantenimiento = 'La fecha es obligatoria';
        if (!mantenimiento.horaInicio)
            nuevosErrores.horaInicio = 'Hora de inicio requerida';
        if (!mantenimiento.horaFin)
            nuevosErrores.horaFin = 'Hora de finalización requerida';

        setErrores(nuevosErrores);
        return Object.keys(nuevosErrores).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validar()) return;

        try {
            await agregarMantenimiento(equipoId, mantenimiento);
            onGuardar(); // Notificar al padre
            onClose();  // Cerrar modal
        } catch (err) {
            alert('Error al registrar mantenimiento');
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
                                'Preventivo',
                                'Correctivo',
                                'Actualización',
                                'Instalación de software',
                                'Limpieza física',
                            ].map((tipo) => (
                                <label key={tipo} className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        name="tipoMantenimiento"
                                        value={tipo}
                                        checked={mantenimiento.tipoMantenimiento === tipo}
                                        onChange={handleChange}
                                    />
                                    {tipo}
                                </label>
                            ))}
                            <input
                                type="text"
                                placeholder="Otro..."
                                value={mantenimiento.tipoMantenimiento}
                                onChange={(e) => setMantenimiento({ ...mantenimiento, tipoMantenimiento: e.target.value })}
                                className="input-otro"
                            />
                        </div>
                        {errores.tipoMantenimiento && (
                            <span className="error-message">{errores.tipoMantenimiento}</span>
                        )}
                    </div>

                    {/* Fecha y horas */}
                    <div className="form-row">
                        <div className="form-group">
                            <label>Fecha:</label>
                            <input
                                type="date"
                                name="fechaMantenimiento"
                                value={mantenimiento.fechaMantenimiento}
                                onChange={handleChange}
                                className={errores.fechaMantenimiento ? 'input-error' : ''}
                            />
                            {errores.fechaMantenimiento && (
                                <span className="error-message">{errores.fechaMantenimiento}</span>
                            )}
                        </div>

                        <div className="form-group">
                            <label>Hora inicio:</label>
                            <input
                                type="time"
                                name="horaInicio"
                                value={mantenimiento.horaInicio}
                                onChange={handleChange}
                                className={errores.horaInicio ? 'input-error' : ''}
                            />
                            {errores.horaInicio && (
                                <span className="error-message">{errores.horaInicio}</span>
                            )}
                        </div>

                        <div className="form-group">
                            <label>Hora fin:</label>
                            <input
                                type="time"
                                name="horaFin"
                                value={mantenimiento.horaFin}
                                onChange={handleChange}
                                className={errores.horaFin ? 'input-error' : ''}
                            />
                            {errores.horaFin && (
                                <span className="error-message">{errores.horaFin}</span>
                            )}
                        </div>
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

                    {/* Botones */}
                    <div className="modal-actions">
                        <button type="submit" className="btn-primary">Guardar</button>
                        <button type="button" className="btn-secondary" onClick={onClose}>
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ModalMantenimiento;