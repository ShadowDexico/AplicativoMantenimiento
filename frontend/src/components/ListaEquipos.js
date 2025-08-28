import '../assets/ListaEquipos.css';
import React, { useEffect, useState } from 'react';
import { getEquipos } from '../services/api';

const ListaEquipos = ({ onSelect }) => {
    const [equipos, setEquipos] = useState([]);

    useEffect(() => {
        cargarEquipos();
    }, []);

    const cargarEquipos = async () => {
        try {
            const res = await getEquipos();
            setEquipos(res.data);
        } catch (err) {
            alert('Error al cargar equipos');
        }
    };

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
                        {equipos.map(eq => (
                            <tr key={eq.id}>
                                <td>{eq.tipoEquipo}</td>
                                <td>{eq.marca}</td>
                                <td>{eq.modelo}</td>
                                <td>{eq.usuarioAsignado}</td>
                                <td>{eq.estado}</td>
                                <td>
                                    <button onClick={() => onSelect(eq)}>Ver</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ListaEquipos;