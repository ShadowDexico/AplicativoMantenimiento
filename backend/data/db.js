// backend/data/db.js
let equipos = [
    // Ejemplo inicial
    {
        id: "1",
        tipoEquipo: "Computadora",
        marca: "Dell",
        modelo: "OptiPlex 3080",
        numeroSerie: "SN123456",
        activoInstitucional: "A-001",
        usuarioAsignado: "Juan Pérez",
        ubicacion: "Oficina 101",
        sistemaOperativo: "Windows 10",
        procesador: "Intel i5-10400",
        memoriaRAM: "8 GB",
        discoDuro: "256 GB SSD",
        fechaCompra: "2022-03-15",
        estado: "activo",
        mantenimientos: [],
        fechaBaja: null,
        responsableBaja: null
    }
];

module.exports = { equipos };