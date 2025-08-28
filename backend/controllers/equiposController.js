const db = require('../data/db');

exports.getEquipos = (req, res) => {
    res.json(db.equipos);
};

exports.crearEquipo = (req, res) => {
    const nuevo = {
        id: Date.now().toString(),
        ...req.body,
        estado: 'activo',
        mantenimientos: [],
        fechaBaja: null,
        responsableBaja: null,
    };
    db.equipos.push(nuevo);
    res.status(201).json(nuevo);
};

exports.actualizarEquipo = (req, res) => {
    const { id } = req.params;
    const index = db.equipos.findIndex(eq => eq.id === id);
    if (index === -1) return res.status(404).json({ error: 'Equipo no encontrado' });

    db.equipos[index] = { ...db.equipos[index], ...req.body };
    res.json(db.equipos[index]);
};

exports.darDeBajaEquipo = (req, res) => {
    const { id } = req.params;
    const { responsableBaja } = req.body;
    const index = db.equipos.findIndex(eq => eq.id === id);
    if (index === -1) return res.status(404).json({ error: 'Equipo no encontrado' });

    db.equipos[index].estado = 'baja';
    db.equipos[index].fechaBaja = new Date().toISOString().split('T')[0];
    db.equipos[index].responsableBaja = responsableBaja;

    res.json(db.equipos[index]);
};

exports.agregarMantenimiento = (req, res) => {
    const { id } = req.params;
    const mantenimiento = { id: Date.now().toString(), ...req.body };

    const equipo = db.equipos.find(eq => eq.id === id);
    if (!equipo) return res.status(404).json({ error: 'Equipo no encontrado' });

    equipo.mantenimientos.push(mantenimiento);
    res.status(201).json(mantenimiento);
};