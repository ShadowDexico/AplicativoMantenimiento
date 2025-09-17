import axios from "axios";

export const API = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL
});

export const getEquipos = () => API.get("/equipos");
export const crearEquipo = (data) => API.post("/equipos", data);
export const actualizarEquipo = (id, data) => API.put(`/equipos/${id}`, data);
export const darDeBajaEquipo = (id, data) =>
  API.patch(`/equipos/${id}/baja`, data);
export const agregarMantenimiento = async (formData) => {
  return await API.post("/equipos/mantenimientos", formData);
};
export const getMantenimientosPorEquipo = (id) =>
  API.get(`/equipos/${id}/mantenimientos`);
export const eliminarEquipo = (id) => API.delete(`/equipos/${id}`);
export const actualizarMantenimiento = (id, data) =>
  API.put(`/equipos/mantenimientos/${id}`, data);
export const eliminarMantenimiento = (id) =>
  API.delete(`/equipos/mantenimientos/${id}`);
