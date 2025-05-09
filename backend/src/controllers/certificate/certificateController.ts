import { Request, Response } from 'express';
import * as certificateService from './certificateService';

/**
 * Get certificates for a specific user
 * GET /api/certificates/user/:id
 */
export const getUserCertificates = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const certificates = await certificateService.getUserCertificates(id);
    res.status(200).json(certificates);
  } catch (error) {
    console.error(`Error fetching certificates for user ${req.params.id}:`, error);
    res.status(500).json({ message: 'Failed to fetch user certificates' });
  }
};

/**
 * Get a specific certificate
 * GET /api/certificates/:id
 */
export const getCertificateById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const certificate = await certificateService.getCertificateById(id);
    
    if (!certificate) {
      return res.status(404).json({ message: 'Certificate not found' });
    }
    
    res.status(200).json(certificate);
  } catch (error) {
    console.error(`Error fetching certificate ${req.params.id}:`, error);
    res.status(500).json({ message: 'Failed to fetch certificate' });
  }
};

/**
 * Generate a new certificate
 * POST /api/certificates
 */
export const generateCertificate = async (req: Request, res: Response) => {
  try {
    const { courseId, tutoringId, customMessage, badgeId } = req.body;
    const userId = (req as any).user.id; // User ID from auth middleware
    
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
      certificate = await certificateService.generateCourseCertificate(
        userId,
        courseId,
        { customMessage, badgeId }
      );
    } else {
      certificate = await certificateService.generateTutoringCertificate(
        userId,
        tutoringId,
        { customMessage, badgeId }
      );
    }
    
    res.status(201).json(certificate);
  } catch (error) {
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