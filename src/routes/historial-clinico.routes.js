const express = require('express');
const router = express.Router();
const { db } = require('../config/firebase-config');

// Obtener todos los historiales cl�nicos
router.get('/', async (req, res) => {
    try {
        const historialSnapshot = await db.collection('historial-clinico').get();
        const historiales = [];
        historialSnapshot.forEach(doc => {
            historiales.push({ id: doc.id, ...doc.data() });
        });
        res.json(historiales);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Obtener un historial cl�nico por ID
router.get('/:id', async (req, res) => {
    try {
        const historialDoc = await db.collection('historial-clinico').doc(req.params.id).get();
        if (!historialDoc.exists) {
            return res.status(404).json({ message: 'Historial cl�nico no encontrado' });
        }
        res.json({ id: historialDoc.id, ...historialDoc.data() });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Crear un nuevo historial cl�nico
router.post('/', async (req, res) => {
    try {
        const historialData = req.body;
        const historialRef = await db.collection('historial-clinico').add(historialData);
        res.status(201).json({ id: historialRef.id, ...historialData });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Actualizar un historial cl�nico existente
router.put('/:id', async (req, res) => {
    try {
        const historialRef = db.collection('historial-clinico').doc(req.params.id);
        const historial = await historialRef.get();
        if (!historial.exists) {
            return res.status(404).json({ message: 'Historial cl�nico no encontrado' });
        }
        await historialRef.update(req.body);
        res.json({ message: 'Historial cl�nico actualizado exitosamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Eliminar un historial cl�nico
router.delete('/:id', async (req, res) => {
    try {
        const historialRef = db.collection('historial-clinico').doc(req.params.id);
        const historial = await historialRef.get();
        if (!historial.exists) {
            return res.status(404).json({ message: 'Historial cl�nico no encontrado' });
        }
        await historialRef.delete();
        res.json({ message: 'Historial cl�nico eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
