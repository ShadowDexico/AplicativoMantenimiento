import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:5000/api',
});

export const getEquipos = () => API.get('/equipos');
export const crearEquipo = (data) => API.post('/equipos', data);
export const actualizarEquipo = (id, data) => API.put(`/equipos/${id}`, data);
export const darDeBajaEquipo = (id, data) => API.patch(`/equipos/${id}/baja`, data);
export const agregarMantenimiento = (id, data) => API.post(`/equipos/${id}/mantenimientos`, data);