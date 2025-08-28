
import React, { useState } from 'react';
import '../assets/FormularioEquipo.css';
import { crearEquipo } from '../services/api';

const FormularioEquipo = ({ onGuardar }) => {
    const [equipo, setEquipo] = useState({
        tipoEquipo: '',
        marca: '',
        modelo: '',
        numeroSerie: '',
        activoInstitucional: '',
        usuarioAsignado: '',
        ubicacion: '',
        sistemaOperativo: '',
        procesador: '',
        memoriaRAM: '',
        discoDuro: '',
        fechaCompra: '',
        nombreDispositivo: '',
        fechaInstalacion: '',
        tieneIP: 'no',
        direccionIP: '',
    });

    const [openDropdown, setOpenDropdown] = useState(null); // Para controlar qué acordeón está abierto
    const [otherTipo, setOtherTipo] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEquipo({ ...equipo, [name]: value });
    };

    const handleSelectTipo = (value) => {
        setEquipo({ ...equipo, tipoEquipo: value });
        setOpenDropdown(null);
    };



    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await crearEquipo(equipo);
            onGuardar(res.data);
            alert('Equipo guardado');
            // reset
            setEquipo({
                tipoEquipo: '',
                marca: '',
                modelo: '',
                numeroSerie: '',
                activoInstitucional: '',
                usuarioAsignado: '',
                ubicacion: '',
                sistemaOperativo: '',
                procesador: '',
                memoriaRAM: '',
                discoDuro: '',
                fechaCompra: '',
            });
            setOtherTipo('');
        } catch (err) {
            alert('Error al guardar');
        }
    };

    const [openAccordion, setOpenAccordion] = useState(false); // Controla si el acordeón está abierto
    return (
        <div className="form-container">
            <h3>Registrar Nuevo Equipo</h3>
            <form onSubmit={handleSubmit}>


                {/* === ACORDEÓN: DETALLES DEL EQUIPO === */}
                <div className="accordion">
                    <div
                        className="accordion-header"
                        onClick={() => setOpenAccordion(!openAccordion)}
                    >
                        <h4>Detalles del equipo</h4>
                        <span className="accordion-arrow">
                            {openAccordion ? '−' : '+'}
                        </span>
                    </div>

                    {openAccordion && (
                        <div className="accordion-body">
                            <div className="form-grid">
                                {/* === ACORDEÓN: TIPO DE EQUIPO === */}
                                {/* Campo: Tipo de equipo (como input falso) */}
                                <div>
                                    <label>Tipo de equipo:</label>
                                    <div
                                        className="dropdown-simulated-input"
                                        onClick={() => setOpenDropdown(openDropdown === 'tipo' ? null : 'tipo')}
                                    >
                                        <span className="dropdown-value">
                                            {equipo.tipoEquipo || 'Seleccionar tipo de equipo'}
                                        </span>
                                        <span className="dropdown-arrow">
                                            {openDropdown === 'tipo' ? '▲' : '▼'}
                                        </span>
                                    </div>

                                    {openDropdown === 'tipo' && (
                                        <div className="dropdown-list-aligned">
                                            {['Computadora', 'Impresora', 'Servidor', 'Notebook'].map((tipo) => (
                                                <div
                                                    key={tipo}
                                                    className="dropdown-item"
                                                    onClick={() => handleSelectTipo(tipo)}
                                                >
                                                    {tipo}
                                                </div>
                                            ))}
                                            <div
                                                className="dropdown-item"
                                                onClick={() => {
                                                    setOpenDropdown('otroTipoInput');
                                                    setEquipo({ ...equipo, tipoEquipo: 'Otro' });
                                                }}
                                            >
                                                Otro...
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Campo "Otro" tipo */}
                                {equipo.tipoEquipo === 'Otro' && (
                                    <div className="form-group">
                                        <label>Especificar tipo:</label>
                                        <input
                                            type="text"
                                            placeholder="Ej. Proyector, Escáner"
                                            value={otherTipo}
                                            onChange={(e) => setOtherTipo(e.target.value)}
                                            onBlur={() => setEquipo({ ...equipo, tipoEquipo: otherTipo })}
                                            autoFocus
                                        />
                                    </div>
                                )}

                                {/* Campo: Marca */}
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

                                {/* Campo: Modelo */}
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

                                {/* Campo: N° Serie */}
                                <div>
                                    <label>N° Serie:</label>
                                    <input
                                        name="numeroSerie"
                                        value={equipo.numeroSerie}
                                        onChange={handleChange}
                                        required
                                        placeholder="ABC123XYZ"
                                    />
                                </div>

                                {/* Campo: Activo Institucional */}
                                <div>
                                    <label>Activo Institucional:</label>
                                    <input
                                        name="activoInstitucional"
                                        value={equipo.activoInstitucional}
                                        onChange={handleChange}
                                        placeholder="SM-XXXX"
                                    />
                                </div>

                                {/* Campo: Usuario asignado */}
                                <div>
                                    <label>Usuario:</label>
                                    <input
                                        name="usuarioAsignado"
                                        value={equipo.usuarioAsignado}
                                        onChange={handleChange}
                                        placeholder="Nombre completo"
                                    />
                                </div>

                                {/* Campo: Ubicación */}
                                <div>
                                    <label>Ubicación:</label>
                                    <input
                                        name="ubicacion"
                                        value={equipo.ubicacion}
                                        onChange={handleChange}
                                        placeholder="URGENCIA, ADMISIONES, ..."
                                    />
                                </div>

                                {/* Campo: Sistema Operativo */}
                                <div>
                                    <label>S.O.:</label>
                                    <input
                                        name="sistemaOperativo"
                                        value={equipo.sistemaOperativo}
                                        onChange={handleChange}
                                        placeholder="Windows 10, macOS, etc."
                                    />
                                </div>

                                {/* Campo: Procesador */}
                                <div>
                                    <label>Procesador:</label>
                                    <input
                                        name="procesador"
                                        value={equipo.procesador}
                                        onChange={handleChange}
                                        placeholder="Intel i5-10400, ..."
                                    />
                                </div>

                                {/* Campo: Memoria RAM */}
                                <div>
                                    <label>RAM:</label>
                                    <input
                                        name="memoriaRAM"
                                        value={equipo.memoriaRAM}
                                        onChange={handleChange}
                                        placeholder="8 GB, 16 GB, ..."
                                    />
                                </div>

                                {/* Campo: Disco duro */}
                                <div>
                                    <label>Disco:</label>
                                    <input
                                        name="discoDuro"
                                        value={equipo.discoDuro}
                                        onChange={handleChange}
                                        placeholder="256 GB SSD, 1 TB HDD, ..."
                                    />
                                </div>

                                {/* Campo: Fecha de compra */}
                                <div>
                                    <label>Fecha de compra:</label>
                                    <input
                                        type="date"
                                        name="fechaCompra"
                                        value={equipo.fechaCompra}
                                        onChange={handleChange}
                                    />
                                </div>

                                {/* Campo: Nombre del dispositivo */}
                                <div>
                                    <label>Nombre del dispositivo:</label>
                                    <input
                                        name="nombreDispositivo"
                                        value={equipo.nombreDispositivo}
                                        onChange={handleChange}
                                        placeholder="PC-Servicios, ..."
                                    />
                                </div>

                                {/* Campo: Fecha de instalación */}
                                <div>
                                    <label>Fecha de instalación:</label>
                                    <input
                                        type="date"
                                        name="fechaInstalacion"
                                        value={equipo.fechaInstalacion}
                                        onChange={handleChange}
                                    />
                                </div>

                                {/* Campo: ¿Tiene IP? */}
                                <div>
                                    <label>Tiene IP?</label>
                                    <div className="radio-group">
                                        <label>
                                            <input
                                                type="radio"
                                                name="tieneIP"
                                                value="si"
                                                checked={equipo.tieneIP === 'si'}
                                                onChange={(e) => setEquipo({ ...equipo, tieneIP: e.target.value })}
                                            />
                                            Sí
                                        </label>
                                        <label style={{ marginLeft: '16px' }}>
                                            <input
                                                type="radio"
                                                name="tieneIP"
                                                value="no"
                                                checked={equipo.tieneIP === 'no'}
                                                onChange={(e) => setEquipo({ ...equipo, tieneIP: e.target.value, direccionIP: '' })}
                                            />
                                            No
                                        </label>
                                    </div>
                                </div>

                                {/* Campo condicional: Dirección IP (solo si tieneIP === 'si') */}
                                {equipo.tieneIP === 'si' && (
                                    <div>
                                        <label>Dirección IP:</label>
                                        <input
                                            type="text"
                                            name="direccionIP"
                                            value={equipo.direccionIP}
                                            onChange={handleChange}
                                            placeholder="192.168.1.100, ..."
                                            pattern="^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$"
                                            title="Ingresa una IP válida (ej: 192.168.1.100)"
                                        />
                                    </div>
                                )}

                                {/* Espacio vacío opcional para alinear */}
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