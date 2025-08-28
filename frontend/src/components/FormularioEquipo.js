import React, { useState } from 'react';
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
    });

    const handleChange = (e) => {
        setEquipo({ ...equipo, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await crearEquipo(equipo);
            onGuardar(res.data);
            alert('Equipo guardado');
        } catch (err) {
            alert('Error al guardar');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h3>Registrar Nuevo Equipo</h3>
            <div>
                <label>Tipo de equipo:</label>
                <div>
                    <label><input type="checkbox" name="tipoEquipo" value="Computadora" onChange={handleChange} /> Computadora</label>
                    <label><input type="checkbox" name="tipoEquipo" value="Impresora" onChange={handleChange} /> Impresora</label>
                    <label><input type="checkbox" name="tipoEquipo" value="Servidor" onChange={handleChange} /> Servidor</label>
                    <label><input type="checkbox" name="tipoEquipo" value="Notebook" onChange={handleChange} /> Notebook</label>
                    <input type="text" placeholder="Otro..." onChange={(e) => setEquipo({ ...equipo, tipoEquipo: e.target.value })} />
                </div>
            </div>

            <div><label>Marca:</label><input name="marca" value={equipo.marca} onChange={handleChange} required /></div>
            <div><label>Modelo:</label><input name="modelo" value={equipo.modelo} onChange={handleChange} required /></div>
            <div><label>N° Serie:</label><input name="numeroSerie" value={equipo.numeroSerie} onChange={handleChange} required /></div>
            <div><label>Activo Institucional:</label><input name="activoInstitucional" value={equipo.activoInstitucional} onChange={handleChange} /></div>
            <div><label>Usuario:</label><input name="usuarioAsignado" value={equipo.usuarioAsignado} onChange={handleChange} /></div>
            <div><label>Ubicación:</label><input name="ubicacion" value={equipo.ubicacion} onChange={handleChange} /></div>
            <div><label>S.O.:</label><input name="sistemaOperativo" value={equipo.sistemaOperativo} onChange={handleChange} /></div>
            <div><label>Procesador:</label><input name="procesador" value={equipo.procesador} onChange={handleChange} /></div>
            <div><label>RAM:</label><input name="memoriaRAM" value={equipo.memoriaRAM} onChange={handleChange} /></div>
            <div><label>Disco:</label><input name="discoDuro" value={equipo.discoDuro} onChange={handleChange} /></div>
            <div><label>Fecha de compra:</label><input type="date" name="fechaCompra" value={equipo.fechaCompra} onChange={handleChange} /></div>

            <button type="submit">Guardar Equipo</button>
        </form>
    );
};

export default FormularioEquipo;