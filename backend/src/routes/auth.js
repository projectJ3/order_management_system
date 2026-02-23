const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../db');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret_jwt_key_goodmilk';

// User Registration
router.post('/register', async (req, res) => {
    const { name, phone, address, password } = req.body;

    if (!name || !phone || !password) {
        return res.status(400).json({ error: 'Name, phone and password are required' });
    }

    try {
        const existing = await prisma.user.findUnique({ where: { phone } });
        if (existing) return res.status(400).json({ error: 'User already exists with this phone' });

        const password_hash = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: { name, phone, address, password_hash }
        });

        const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '7d' });
        res.json({ token, user: { id: user.id, name: user.name, phone: user.phone, address: user.address, role: user.role } });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// User Login
router.post('/login', async (req, res) => {
    const { phone, password } = req.body;

    try {
        const user = await prisma.user.findUnique({ where: { phone } });
        if (!user) return res.status(404).json({ error: 'User not found' });

        const valid = await bcrypt.compare(password, user.password_hash);
        if (!valid) return res.status(401).json({ error: 'Invalid password' });

        const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '7d' });
        res.json({ token, user: { id: user.id, name: user.name, phone: user.phone, address: user.address, role: user.role } });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
