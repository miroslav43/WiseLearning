"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
// Get all subscription plans
router.get('/plans', async (req, res) => {
    res.status(501).json({ message: 'Not implemented yet' });
});
// Subscribe to a plan
router.post('/subscribe', authMiddleware_1.authenticate, async (req, res) => {
    res.status(501).json({ message: 'Not implemented yet' });
});
// Get current user's subscription
router.get('/my', authMiddleware_1.authenticate, async (req, res) => {
    res.status(501).json({ message: 'Not implemented yet' });
});
// Cancel subscription
router.put('/:id/cancel', authMiddleware_1.authenticate, async (req, res) => {
    res.status(501).json({ message: 'Not implemented yet' });
});
// Get course bundles
router.get('/bundles', async (req, res) => {
    res.status(501).json({ message: 'Not implemented yet' });
});
// Purchase a bundle
router.post('/bundles/:id/purchase', authMiddleware_1.authenticate, async (req, res) => {
    res.status(501).json({ message: 'Not implemented yet' });
});
exports.default = router;
