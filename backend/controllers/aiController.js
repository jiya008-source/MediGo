import { diagnoseSymptoms } from '../services/aiService.js';

// Rate limiting store (simple in-memory, can be replaced with Redis in production)
const rateLimitStore = new Map();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 10; // 10 requests per minute per IP

/**
 * Simple rate limiting middleware
 */
const checkRateLimit = (ip) => {
  const now = Date.now();
  const userRequests = rateLimitStore.get(ip) || [];

  // Remove old requests outside the window
  const recentRequests = userRequests.filter(timestamp => now - timestamp < RATE_LIMIT_WINDOW);

  if (recentRequests.length >= RATE_LIMIT_MAX_REQUESTS) {
    return false;
  }

  // Add current request
  recentRequests.push(now);
  rateLimitStore.set(ip, recentRequests);
  return true;
};

/**
 * Diagnose symptoms endpoint controller
 * POST /api/ai/diagnose
 */
export const diagnoseSymptomsController = async (req, res) => {
  try {
    // Rate limiting
    const clientIp = req.ip || req.connection.remoteAddress || 'unknown';
    if (!checkRateLimit(clientIp)) {
      return res.status(429).json({
        success: false,
        message: 'Too many requests. Please try again in a minute.',
      });
    }

    // Validation
    const { symptoms } = req.body;

    if (!symptoms || typeof symptoms !== 'string' || symptoms.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Symptoms are required and must be a non-empty string.',
      });
    }

    if (symptoms.length > 1000) {
      return res.status(400).json({
        success: false,
        message: 'Symptoms description is too long. Please keep it under 1000 characters.',
      });
    }

    // Call AI service
    const diagnosis = await diagnoseSymptoms(symptoms.trim());

    // Return structured response
    res.json({
      success: true,
      data: {
        condition: diagnosis.condition,
        specialization: diagnosis.specialization,
        advice: diagnosis.advice,
        confidence: diagnosis.confidence,
      },
    });
  } catch (error) {
    console.error('Error in diagnoseSymptomsController:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while processing your request. Please try again later.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

