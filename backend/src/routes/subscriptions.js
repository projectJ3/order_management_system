const express = require('express');
const { authenticate } = require('../utils/auth');
const prisma = require('../db');
const router = express.Router();

// Get user subscriptions
router.get('/', authenticate, async (req, res) => {
    try {
        const subs = await prisma.subscription.findMany({
            where: { userId: req.user.id },
            orderBy: { createdAt: 'desc' }
        });
        res.json(subs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create subscription
router.post('/', authenticate, async (req, res) => {
    const { product, quantity, frequency, startDate } = req.body;
    try {
        const sub = await prisma.subscription.create({
            data: {
                userId: req.user.id,
                product,
                quantity,
                frequency,
                startDate: new Date(startDate)
            }
        });
        res.json(sub);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Pause/Resume/Cancel subscription
router.patch('/:id/status', authenticate, async (req, res) => {
    const { status } = req.body; // "ACTIVE", "PAUSED", "CANCELLED"
    try {
        // verify ownership
        const sub = await prisma.subscription.findUnique({ where: { id: req.params.id } });
        if (!sub || sub.userId !== req.user.id) return res.sendStatus(403);

        const updated = await prisma.subscription.update({
            where: { id: req.params.id },
            data: { status }
        });
        res.json(updated);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
