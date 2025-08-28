
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

    const [openDropdown, setOpenDropdown] = useState(null);
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
                        <span className="accordion-arrow">
                            {openAccordion ? '−' : '+'}
                        </span>
                    </div>

                    {openAccordion && (
                        <div className="accordion-body">
                            <div className="form-grid">
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
                                        name="numeroSerie"
                                        value={equipo.numeroSerie}
                                        onChange={handleChange}
                                        required
                                        placeholder="ABC123XYZ"
                                    />
                                </div>
                                <div>
                                    <label>Activo Institucional:</label>
                                    <input
                                        name="activoInstitucional"
                                        value={equipo.activoInstitucional}
                                        onChange={handleChange}
                                        placeholder="SM-XXXX"
                                    />
                                </div>

                                <div>
                                    <label>Usuario:</label>
                                    <input
                                        name="usuarioAsignado"
                                        value={equipo.usuarioAsignado}
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
                                        name="sistemaOperativo"
                                        value={equipo.sistemaOperativo}
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
                                        name="memoriaRAM"
                                        value={equipo.memoriaRAM}
                                        onChange={handleChange}
                                        placeholder="8 GB, 16 GB, ..."
                                    />
                                </div>
                                <div>
                                    <label>Disco:</label>
                                    <input
                                        name="discoDuro"
                                        value={equipo.discoDuro}
                                        onChange={handleChange}
                                        placeholder="256 GB SSD, 1 TB HDD, ..."
                                    />
                                </div>

                                <div>
                                    <label>Fecha de compra:</label>
                                    <input
                                        type="date"
                                        name="fechaCompra"
                                        value={equipo.fechaCompra}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div>
                                    <label>Nombre del dispositivo:</label>
                                    <input
                                        name="nombreDispositivo"
                                        value={equipo.nombreDispositivo}
                                        onChange={handleChange}
                                        placeholder="PC-Servicios, ..."
                                    />
                                </div>

                                <div>
                                    <label>Fecha de instalación:</label>
                                    <input
                                        type="date"
                                        name="fechaInstalacion"
                                        value={equipo.fechaInstalacion}
                                        onChange={handleChange}
                                    />
                                </div>

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