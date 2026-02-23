const express = require('express');
const { authenticate, adminOnly } = require('../utils/auth');
const prisma = require('../db');
const router = express.Router();

// Get user orders
router.get('/', authenticate, async (req, res) => {
    try {
        const orders = await prisma.order.findMany({
            where: { userId: req.user.id },
            orderBy: { deliveryDate: 'desc' }
        });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Place one-time order (Authenticated)
router.post('/', authenticate, async (req, res) => {
    const { product, quantity, deliveryDate, name, phone, address } = req.body;

    try {
        const user = await prisma.user.findUnique({ where: { id: req.user.id } });
        const order = await prisma.order.create({
            data: {
                userId: user.id,
                name: name || user.name,
                phone: phone || user.phone,
                address: address || user.address,
                product,
                quantity,
                deliveryDate: new Date(deliveryDate),
                source: 'WEBSITE'
            }
        });
        res.json(order);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Admin Get All Orders (With optional filtering)
router.get('/admin', authenticate, adminOnly, async (req, res) => {
    try {
        const orders = await prisma.order.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                user: { select: { name: true, phone: true } }
            }
        });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const { generateAdminReport } = require('../utils/excelGenerator');
router.get('/admin/export', authenticate, adminOnly, async (req, res) => {
    try {
        const reportPath = await generateAdminReport();
        res.download(reportPath);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
