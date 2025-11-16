// Symptom to Disease Prediction Service
// This is a rule-based approach that maps symptoms to diseases

const symptomToDiseaseMap = {
  // Fever-related diseases
  'fever': {
    'common_cold': ['cough', 'sneezing', 'runny_nose', 'sore_throat'],
    'flu': ['body_ache', 'fatigue', 'chills', 'headache'],
    'dengue': ['severe_headache', 'joint_pain', 'rash', 'bleeding'],
    'malaria': ['chills', 'sweating', 'nausea', 'vomiting']
  },
  
  // Head-related symptoms
  'headache': {
    'migraine': ['nausea', 'sensitivity_to_light', 'sensitivity_to_sound'],
    'tension_headache': ['neck_pain', 'shoulder_pain'],
    'sinusitis': ['facial_pain', 'nasal_congestion', 'post_nasal_drip']
  },
  
  // Stomach-related symptoms
  'stomach_pain': {
    'gastritis': ['nausea', 'bloating', 'indigestion'],
    'food_poisoning': ['vomiting', 'diarrhea', 'fever'],
    'appendicitis': ['right_lower_abdominal_pain', 'nausea', 'fever'],
    'ibs': ['bloating', 'diarrhea', 'constipation', 'gas']
  },
  
  // Skin-related symptoms
  'rash': {
    'allergy': ['itching', 'swelling', 'hives'],
    'eczema': ['dry_skin', 'itching', 'redness'],
    'psoriasis': ['scaly_patches', 'itching', 'joint_pain']
  },
  
  // Respiratory symptoms
  'cough': {
    'bronchitis': ['chest_tightness', 'shortness_of_breath', 'phlegm'],
    'pneumonia': ['fever', 'chest_pain', 'shortness_of_breath'],
    'asthma': ['wheezing', 'shortness_of_breath', 'chest_tightness']
  },
  
  // Joint and muscle symptoms
  'joint_pain': {
    'arthritis': ['stiffness', 'swelling', 'reduced_range_of_motion'],
    'gout': ['swelling', 'redness', 'tenderness']
  }
}

// Disease to Doctor Speciality Mapping
const diseaseToSpecialityMap = {
  'common_cold': 'General physician',
  'flu': 'General physician',
  'dengue': 'General physician',
  'malaria': 'General physician',
  'migraine': 'Neurologist',
  'tension_headache': 'General physician',
  'sinusitis': 'General physician',
  'gastritis': 'Gastroenterologist',
  'food_poisoning': 'General physician',
  'appendicitis': 'General physician',
  'ibs': 'Gastroenterologist',
  'allergy': 'General physician',
  'eczema': 'Dermatologist',
  'psoriasis': 'Dermatologist',
  'bronchitis': 'General physician',
  'pneumonia': 'General physician',
  'asthma': 'General physician',
  'arthritis': 'General physician',
  'gout': 'General physician'
}

// Normalize symptoms to lowercase and replace spaces with underscores
const normalizeSymptom = (symptom) => {
  return symptom.toLowerCase().trim().replace(/\s+/g, '_');
}

// Predict disease based on symptoms
export const predictDisease = (symptoms) => {
  if (!symptoms || symptoms.length === 0) {
    return { disease: null, confidence: 0, message: 'Please provide symptoms' };
  }

  const normalizedSymptoms = symptoms.map(normalizeSymptom);
  const diseaseScores = {};

  // Score each disease based on matching symptoms
  for (const [primarySymptom, diseases] of Object.entries(symptomToDiseaseMap)) {
    if (normalizedSymptoms.includes(primarySymptom)) {
      for (const [disease, relatedSymptoms] of Object.entries(diseases)) {
        if (!diseaseScores[disease]) {
          diseaseScores[disease] = { score: 0, matchedSymptoms: [] };
        }
        
        // Primary symptom match
        diseaseScores[disease].score += 2;
        diseaseScores[disease].matchedSymptoms.push(primarySymptom);
        
        // Related symptoms match
        normalizedSymptoms.forEach(symptom => {
          if (relatedSymptoms.includes(symptom)) {
            diseaseScores[disease].score += 1;
            if (!diseaseScores[disease].matchedSymptoms.includes(symptom)) {
              diseaseScores[disease].matchedSymptoms.push(symptom);
            }
          }
        });
      }
    }
  }

  // Also check for diseases that match based on all symptoms
  for (const [primarySymptom, diseases] of Object.entries(symptomToDiseaseMap)) {
    for (const [disease, relatedSymptoms] of Object.entries(diseases)) {
      const allDiseaseSymptoms = [primarySymptom, ...relatedSymptoms];
      const matchCount = normalizedSymptoms.filter(s => allDiseaseSymptoms.includes(s)).length;
      
      if (matchCount >= 2 && !diseaseScores[disease]) {
        diseaseScores[disease] = { score: matchCount, matchedSymptoms: [] };
        normalizedSymptoms.forEach(symptom => {
          if (allDiseaseSymptoms.includes(symptom)) {
            diseaseScores[disease].matchedSymptoms.push(symptom);
          }
        });
      }
    }
  }

  // Find the disease with highest score
  let maxScore = 0;
  let predictedDisease = null;
  let matchedSymptoms = [];

  for (const [disease, data] of Object.entries(diseaseScores)) {
    if (data.score > maxScore) {
      maxScore = data.score;
      predictedDisease = disease;
      matchedSymptoms = data.matchedSymptoms;
    }
  }

  if (!predictedDisease) {
    return {
      disease: null,
      confidence: 0,
      message: 'Could not determine a specific disease. Please consult a General Physician.',
      suggestedSpeciality: 'General physician'
    };
  }

  const confidence = Math.min(100, Math.round((maxScore / (normalizedSymptoms.length + 2)) * 100));
  const suggestedSpeciality = diseaseToSpecialityMap[predictedDisease] || 'General physician';

  return {
    disease: predictedDisease.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
    confidence,
    matchedSymptoms,
    suggestedSpeciality,
    message: `Based on your symptoms, you might have ${predictedDisease.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}. We recommend consulting a ${suggestedSpeciality}.`
  };
}

// Get suggested speciality for a disease
export const getSuggestedSpeciality = (disease) => {
  const normalizedDisease = normalizeSymptom(disease);
  return diseaseToSpecialityMap[normalizedDisease] || 'General physician';
}

