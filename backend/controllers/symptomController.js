import { predictDisease } from '../services/symptomPredictor.js';
import doctorModel from '../models/doctorModel.js';

// Predict disease from symptoms and suggest doctors
export const predictFromSymptoms = async (req, res) => {
  try {
    const { symptoms } = req.body;

    if (!symptoms || !Array.isArray(symptoms) || symptoms.length === 0) {
      return res.json({
        success: false,
        message: 'Please provide symptoms as an array'
      });
    }

    // Predict disease
    const prediction = predictDisease(symptoms);

    // Find doctors based on suggested speciality
    let suggestedDoctors = [];
    if (prediction.suggestedSpeciality) {
      suggestedDoctors = await doctorModel.find({
        speciality: prediction.suggestedSpeciality,
        available: true
      }).select(['-password', '-email']).limit(5);
    }

    // If no doctors found for the speciality, get general physicians
    if (suggestedDoctors.length === 0) {
      suggestedDoctors = await doctorModel.find({
        speciality: 'General physician',
        available: true
      }).select(['-password', '-email']).limit(5);
    }

    res.json({
      success: true,
      prediction: {
        disease: prediction.disease,
        confidence: prediction.confidence,
        message: prediction.message,
        matchedSymptoms: prediction.matchedSymptoms,
        suggestedSpeciality: prediction.suggestedSpeciality
      },
      suggestedDoctors
    });

  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message
    });
  }
};

