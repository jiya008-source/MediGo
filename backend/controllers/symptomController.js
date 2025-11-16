import { predictDiseaseAdvanced, recommendDoctors } from '../services/aiRecommendationSystem.js';
import doctorModel from '../models/doctorModel.js';

// Advanced AI-powered symptom prediction and doctor recommendation
export const predictFromSymptoms = async (req, res) => {
  try {
    const { symptoms } = req.body;

    if (!symptoms || !Array.isArray(symptoms) || symptoms.length === 0) {
      return res.json({
        success: false,
        message: 'Please provide symptoms as an array'
      });
    }

    // Use advanced AI prediction
    const prediction = predictDiseaseAdvanced(symptoms);

    // Get all available doctors
    const allDoctors = await doctorModel.find({ available: true })
      .select(['-password', '-email']);

    // Use intelligent recommendation algorithm
    const suggestedDoctors = recommendDoctors(prediction, allDoctors);

    // Format response
    const response = {
      success: true,
      prediction: {
        primaryDisease: prediction.primaryDisease?.disease || null,
        confidence: prediction.primaryDisease?.confidence || 0,
        message: prediction.message,
        matchedSymptoms: prediction.primaryDisease?.matchedSymptoms || [],
        suggestedSpeciality: prediction.suggestedSpeciality,
        alternativeSpecialities: prediction.alternativeSpecialities || [],
        possibleDiseases: prediction.diseases?.map(d => ({
          disease: d.disease,
          confidence: d.confidence
        })) || []
      },
      suggestedDoctors: suggestedDoctors.map(doc => ({
        _id: doc._id,
        name: doc.name,
        speciality: doc.speciality,
        experience: doc.experience,
        fees: doc.fees,
        image: doc.image,
        about: doc.about,
        address: doc.address,
        recommendationScore: doc.recommendationScore,
        matchReason: doc.speciality === prediction.suggestedSpeciality 
          ? 'Perfect match for your condition' 
          : prediction.alternativeSpecialities?.includes(doc.speciality)
          ? 'Alternative specialist'
          : 'General physician'
      }))
    };

    res.json(response);

  } catch (error) {
    console.log('Error in predictFromSymptoms:', error);
    res.json({
      success: false,
      message: error.message
    });
  }
};

