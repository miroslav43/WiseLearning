"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateCertificate = exports.getCertificateById = exports.getUserCertificates = void 0;
const certificateService = __importStar(require("./certificateService"));
/**
 * Get certificates for a specific user
 * GET /api/certificates/user/:id
 */
const getUserCertificates = async (req, res) => {
    try {
        const { id } = req.params;
        const certificates = await certificateService.getUserCertificates(id);
        res.status(200).json(certificates);
    }
    catch (error) {
        console.error(`Error fetching certificates for user ${req.params.id}:`, error);
        res.status(500).json({ message: 'Failed to fetch user certificates' });
    }
};
exports.getUserCertificates = getUserCertificates;
/**
 * Get a specific certificate
 * GET /api/certificates/:id
 */
const getCertificateById = async (req, res) => {
    try {
        const { id } = req.params;
        const certificate = await certificateService.getCertificateById(id);
        if (!certificate) {
            return res.status(404).json({ message: 'Certificate not found' });
        }
        res.status(200).json(certificate);
    }
    catch (error) {
        console.error(`Error fetching certificate ${req.params.id}:`, error);
        res.status(500).json({ message: 'Failed to fetch certificate' });
    }
};
exports.getCertificateById = getCertificateById;
/**
 * Generate a new certificate
 * POST /api/certificates
 */
const generateCertificate = async (req, res) => {
    try {
        const { courseId, tutoringId, customMessage, badgeId } = req.body;
        const userId = req.user.id; // User ID from auth middleware
        // User must provide either courseId or tutoringId
        if (!courseId && !tutoringId) {
            return res.status(400).json({
                message: 'Either courseId or tutoringId must be provided'
            });
        }
        // Cannot provide both
        if (courseId && tutoringId) {
            return res.status(400).json({
                message: 'Cannot generate certificate for both course and tutoring at the same time'
            });
        }
        let certificate;
        if (courseId) {
            certificate = await certificateService.generateCourseCertificate(userId, courseId, { customMessage, badgeId });
        }
        else {
            certificate = await certificateService.generateTutoringCertificate(userId, tutoringId, { customMessage, badgeId });
        }
        res.status(201).json(certificate);
    }
    catch (error) {
        console.error('Error generating certificate:', error);
        // Handle specific error messages
        if (error instanceof Error) {
            if (error.message.includes('not completed') ||
                error.message.includes('not found')) {
                return res.status(400).json({ message: error.message });
            }
        }
        res.status(500).json({ message: 'Failed to generate certificate' });
    }
};
exports.generateCertificate = generateCertificate;
