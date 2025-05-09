import { Router } from 'express';
import * as certificateController from '../controllers/certificate';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

// Get certificates for a specific user
router.get('/user/:id', certificateController.getUserCertificates);

// Generate a new certificate
router.post('/', authenticate, certificateController.generateCertificate);

// Get a specific certificate
router.get('/:id', certificateController.getCertificateById);

export default router; 