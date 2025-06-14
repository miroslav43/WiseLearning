"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const client_1 = require("@prisma/client");
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
// Import routes
const achievementRoutes_1 = __importDefault(require("./routes/achievementRoutes"));
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const blogRoutes_1 = __importDefault(require("./routes/blogRoutes"));
const calendarRoutes_1 = __importDefault(require("./routes/calendarRoutes"));
const certificateRoutes_1 = __importDefault(require("./routes/certificateRoutes"));
const courseRoutes_1 = __importDefault(require("./routes/courseRoutes"));
const messagingRoutes_1 = __importDefault(require("./routes/messagingRoutes"));
const notificationRoutes_1 = __importDefault(require("./routes/notificationRoutes"));
const paymentRoutes_1 = __importDefault(require("./routes/paymentRoutes"));
const pointsRoutes_1 = __importDefault(require("./routes/pointsRoutes"));
const reviewRoutes_1 = __importDefault(require("./routes/reviewRoutes"));
const subscriptionRoutes_1 = __importDefault(require("./routes/subscriptionRoutes"));
const tutoringRoutes_1 = __importDefault(require("./routes/tutoringRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
// Initialize environment variables
dotenv_1.default.config();
// Create Express app
const app = (0, express_1.default)();
const port = process.env.PORT || 5000;
// Initialize Prisma client
exports.prisma = new client_1.PrismaClient();
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Simple logging middleware
app.use((req, _res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
});
// API routes
app.use('/api/auth', authRoutes_1.default);
app.use('/api/users', userRoutes_1.default);
app.use('/api/courses', courseRoutes_1.default);
app.use('/api/tutoring', tutoringRoutes_1.default);
app.use('/api/achievements', achievementRoutes_1.default);
app.use('/api/certificates', certificateRoutes_1.default);
app.use('/api/messaging', messagingRoutes_1.default);
app.use('/api/notifications', notificationRoutes_1.default);
app.use('/api/reviews', reviewRoutes_1.default);
app.use('/api/calendar', calendarRoutes_1.default);
app.use('/api/subscriptions', subscriptionRoutes_1.default);
app.use('/api/payments', paymentRoutes_1.default);
app.use('/api/points', pointsRoutes_1.default);
app.use('/api/blog', blogRoutes_1.default);
app.use('/api/admin', adminRoutes_1.default);
// Health check endpoint
app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date() });
});
// Error handling middleware
app.use((err, _req, res, _next) => {
    console.error(err.stack);
    res.status(500).json({
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});
// Not found middleware
app.use((_req, res) => {
    res.status(404).json({ message: 'Resource not found' });
});
// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
// Graceful shutdown
process.on('SIGINT', async () => {
    await exports.prisma.$disconnect();
    console.log('Prisma client disconnected');
    process.exit(0);
});
exports.default = app;
