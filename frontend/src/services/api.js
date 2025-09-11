import axios from "axios";

const API = axios.create({
  baseURL: "http://10.20.0.238:3150/api",
});

export const getEquipos = () => API.get("/equipos");
export const crearEquipo = (data) => API.post("/equipos", data);
export const actualizarEquipo = (id, data) => API.put(`/equipos/${id}`, data);
export const darDeBajaEquipo = (id, data) =>
  API.patch(`/equipos/${id}/baja`, data);
export const agregarMantenimiento = (id, data) =>
  API.post(`/equipos/${id}/mantenimientos`, data);
export const getMantenimientosPorEquipo = (id) =>
  API.get(`/equipos/${id}/mantenimientos`);
export const eliminarEquipo = (id) => API.delete(`/equipos/${id}`);
export const actualizarMantenimiento = (id, data) =>
  API.put(`/equipos/mantenimientos/${id}`, data);
export const eliminarMantenimiento = (id) =>
  API.delete(`/equipos/mantenimientos/${id}`);
