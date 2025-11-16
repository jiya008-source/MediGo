// Advanced AI/ML Doctor Recommendation System
// Uses weighted scoring and intelligent matching algorithms

// Comprehensive Disease to Speciality Mapping with priority
const diseaseSpecialityMap = {
  // Neurological
  'migraine': { speciality: 'Neurologist', priority: 1, alternative: [] },
  'epilepsy': { speciality: 'Neurologist', priority: 1, alternative: [] },
  'parkinson': { speciality: 'Neurologist', priority: 1, alternative: [] },
  'stroke': { speciality: 'Neurologist', priority: 1, alternative: ['General physician'] },
  'tension_headache': { speciality: 'Neurologist', priority: 2, alternative: ['General physician'] },
  'cluster_headache': { speciality: 'Neurologist', priority: 1, alternative: [] },
  
  // Dermatological
  'eczema': { speciality: 'Dermatologist', priority: 1, alternative: [] },
  'psoriasis': { speciality: 'Dermatologist', priority: 1, alternative: [] },
  'acne': { speciality: 'Dermatologist', priority: 1, alternative: [] },
  'dermatitis': { speciality: 'Dermatologist', priority: 1, alternative: [] },
  'skin_infection': { speciality: 'Dermatologist', priority: 1, alternative: ['General physician'] },
  'rash': { speciality: 'Dermatologist', priority: 2, alternative: ['General physician'] },
  'allergy': { speciality: 'Dermatologist', priority: 2, alternative: ['General physician'] },
  
  // Gastrointestinal
  'gastritis': { speciality: 'Gastroenterologist', priority: 1, alternative: [] },
  'ibs': { speciality: 'Gastroenterologist', priority: 1, alternative: [] },
  'crohn': { speciality: 'Gastroenterologist', priority: 1, alternative: [] },
  'ulcerative_colitis': { speciality: 'Gastroenterologist', priority: 1, alternative: [] },
  'gerd': { speciality: 'Gastroenterologist', priority: 1, alternative: [] },
  'appendicitis': { speciality: 'Gastroenterologist', priority: 1, alternative: ['General physician'] },
  'food_poisoning': { speciality: 'Gastroenterologist', priority: 2, alternative: ['General physician'] },
  
  // Gynecological
  'pcos': { speciality: 'Gynecologist', priority: 1, alternative: [] },
  'endometriosis': { speciality: 'Gynecologist', priority: 1, alternative: [] },
  'menstrual_disorder': { speciality: 'Gynecologist', priority: 1, alternative: [] },
  'pregnancy': { speciality: 'Gynecologist', priority: 1, alternative: [] },
  'uti': { speciality: 'Gynecologist', priority: 2, alternative: ['General physician'] },
  
  // Pediatric
  'childhood_fever': { speciality: 'Pediatricians', priority: 1, alternative: [] },
  'childhood_cough': { speciality: 'Pediatricians', priority: 1, alternative: [] },
  'childhood_rash': { speciality: 'Pediatricians', priority: 1, alternative: ['Dermatologist'] },
  'growth_issues': { speciality: 'Pediatricians', priority: 1, alternative: [] },
  
  // General/Common
  'common_cold': { speciality: 'General physician', priority: 1, alternative: [] },
  'flu': { speciality: 'General physician', priority: 1, alternative: [] },
  'sinusitis': { speciality: 'General physician', priority: 1, alternative: [] },
  'bronchitis': { speciality: 'General physician', priority: 1, alternative: [] },
  'pneumonia': { speciality: 'General physician', priority: 1, alternative: [] },
  'asthma': { speciality: 'General physician', priority: 1, alternative: [] },
  'dengue': { speciality: 'General physician', priority: 1, alternative: [] },
  'malaria': { speciality: 'General physician', priority: 1, alternative: [] },
  'arthritis': { speciality: 'General physician', priority: 1, alternative: [] },
  'gout': { speciality: 'General physician', priority: 1, alternative: [] },
}

// Enhanced Symptom to Disease Mapping with weights
const symptomDiseaseMapping = {
  // Primary symptoms with weighted associations
  'fever': {
    'common_cold': { weight: 0.3, required: ['cough', 'sneezing', 'runny_nose', 'sore_throat'] },
    'flu': { weight: 0.4, required: ['body_ache', 'fatigue', 'chills'] },
    'dengue': { weight: 0.5, required: ['severe_headache', 'joint_pain', 'rash'] },
    'malaria': { weight: 0.5, required: ['chills', 'sweating', 'nausea'] },
    'pneumonia': { weight: 0.6, required: ['chest_pain', 'shortness_of_breath', 'cough'] },
    'childhood_fever': { weight: 0.4, required: ['cough', 'irritability'] }
  },
  'headache': {
    'migraine': { weight: 0.7, required: ['nausea', 'sensitivity_to_light', 'sensitivity_to_sound'] },
    'tension_headache': { weight: 0.5, required: ['neck_pain', 'shoulder_pain'] },
    'cluster_headache': { weight: 0.6, required: ['eye_pain', 'tearing'] },
    'sinusitis': { weight: 0.5, required: ['facial_pain', 'nasal_congestion'] }
  },
  'stomach_pain': {
    'gastritis': { weight: 0.6, required: ['nausea', 'bloating', 'indigestion'] },
    'ibs': { weight: 0.6, required: ['bloating', 'diarrhea', 'constipation'] },
    'appendicitis': { weight: 0.8, required: ['right_lower_abdominal_pain', 'nausea', 'fever'] },
    'food_poisoning': { weight: 0.7, required: ['vomiting', 'diarrhea'] },
    'gerd': { weight: 0.6, required: ['heartburn', 'acid_reflux'] }
  },
  'rash': {
    'eczema': { weight: 0.7, required: ['dry_skin', 'itching', 'redness'] },
    'psoriasis': { weight: 0.7, required: ['scaly_patches', 'itching'] },
    'dermatitis': { weight: 0.6, required: ['itching', 'redness', 'swelling'] },
    'allergy': { weight: 0.5, required: ['itching', 'swelling', 'hives'] },
    'skin_infection': { weight: 0.6, required: ['redness', 'swelling', 'pain'] }
  },
  'cough': {
    'bronchitis': { weight: 0.6, required: ['chest_tightness', 'phlegm'] },
    'pneumonia': { weight: 0.7, required: ['fever', 'chest_pain', 'shortness_of_breath'] },
    'asthma': { weight: 0.7, required: ['wheezing', 'shortness_of_breath'] },
    'common_cold': { weight: 0.5, required: ['sneezing', 'runny_nose'] },
    'childhood_cough': { weight: 0.6, required: ['fever', 'irritability'] }
  },
  'joint_pain': {
    'arthritis': { weight: 0.6, required: ['stiffness', 'swelling'] },
    'gout': { weight: 0.7, required: ['swelling', 'redness', 'tenderness'] }
  }
}

// Normalize symptom text
const normalizeSymptom = (symptom) => {
  return symptom.toLowerCase().trim().replace(/\s+/g, '_');
}

// Calculate disease probability using weighted scoring
const calculateDiseaseScore = (symptoms, disease, mapping, primarySymptom) => {
  let score = 0;
  let matchedSymptoms = [];
  const required = mapping.required || [];
  const weight = mapping.weight || 0.5;
  
  // Check primary symptom
  if (primarySymptom && symptoms.includes(primarySymptom)) {
    score += weight * 2;
    matchedSymptoms.push(primarySymptom);
  }
  
  // Check required symptoms
  const matchedRequired = required.filter(req => symptoms.includes(req));
  if (required.length > 0) {
    score += (matchedRequired.length / required.length) * weight * 3;
  }
  matchedSymptoms.push(...matchedRequired);
  
  // Bonus for matching all required symptoms
  if (required.length > 0 && matchedRequired.length === required.length) {
    score += weight * 2;
  }
  
  return { score, matchedSymptoms, confidence: Math.min(100, Math.round(score * 20)) };
}

// Predict disease with confidence scores
export const predictDiseaseAdvanced = (symptoms) => {
  if (!symptoms || symptoms.length === 0) {
    return { diseases: [], message: 'Please provide symptoms' };
  }

  const normalizedSymptoms = symptoms.map(normalizeSymptom);
  const diseaseScores = {};

  // Score each disease based on symptom mapping
  for (const [primarySymptom, diseases] of Object.entries(symptomDiseaseMapping)) {
    if (normalizedSymptoms.includes(primarySymptom)) {
      for (const [disease, mapping] of Object.entries(diseases)) {
        const result = calculateDiseaseScore(normalizedSymptoms, disease, mapping, primarySymptom);
        
        if (!diseaseScores[disease]) {
          diseaseScores[disease] = {
            score: 0,
            matchedSymptoms: [],
            confidence: 0
          };
        }
        
        diseaseScores[disease].score += result.score;
        diseaseScores[disease].matchedSymptoms = [...new Set([...diseaseScores[disease].matchedSymptoms, ...result.matchedSymptoms])];
        diseaseScores[disease].confidence = Math.min(100, Math.round(diseaseScores[disease].score * 15));
      }
    }
  }

  // Sort diseases by score
  const sortedDiseases = Object.entries(diseaseScores)
    .map(([disease, data]) => ({
      disease: disease.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      diseaseKey: disease,
      confidence: data.confidence,
      score: data.score,
      matchedSymptoms: data.matchedSymptoms
    }))
    .sort((a, b) => b.score - a.score)
    .filter(d => d.confidence > 20); // Only return diseases with >20% confidence

  if (sortedDiseases.length === 0) {
    return {
      diseases: [],
      message: 'Could not determine a specific disease. Please consult a General Physician.',
      suggestedSpeciality: 'General physician'
    };
  }

  const topDisease = sortedDiseases[0];
  const specialityInfo = diseaseSpecialityMap[topDisease.diseaseKey] || { 
    speciality: 'General physician', 
    priority: 3, 
    alternative: [] 
  };

  return {
    diseases: sortedDiseases.slice(0, 3), // Top 3 diseases
    primaryDisease: topDisease,
    suggestedSpeciality: specialityInfo.speciality,
    alternativeSpecialities: specialityInfo.alternative,
    priority: specialityInfo.priority,
    message: `Based on your symptoms, you might have ${topDisease.disease} (${topDisease.confidence}% confidence). We recommend consulting a ${specialityInfo.speciality}.`
  };
}

// Intelligent Doctor Recommendation Algorithm
export const recommendDoctors = (prediction, allDoctors) => {
  if (!allDoctors || allDoctors.length === 0) {
    return [];
  }

  const recommended = [];
  const speciality = prediction.suggestedSpeciality;
  const alternativeSpecialities = prediction.alternativeSpecialities || [];
  const priority = prediction.priority || 3;

  // Score doctors based on multiple factors
  const scoredDoctors = allDoctors.map(doctor => {
    let score = 0;
    
    // Speciality match (highest weight)
    if (doctor.speciality === speciality) {
      score += 100 * priority;
    } else if (alternativeSpecialities.includes(doctor.speciality)) {
      score += 50 * priority;
    } else {
      score -= 50; // Penalty for wrong speciality
    }
    
    // Availability bonus
    if (doctor.available) {
      score += 20;
    }
    
    // Experience bonus (more experience = higher score)
    const experienceYears = parseInt(doctor.experience) || 0;
    score += Math.min(experienceYears * 2, 30);
    
    // Lower fees = slight bonus (accessibility)
    const fees = doctor.fees || 0;
    score += Math.max(0, 10 - (fees / 100));
    
    return { ...doctor, recommendationScore: score };
  });

  // Sort by recommendation score
  scoredDoctors.sort((a, b) => b.recommendationScore - a.recommendationScore);

  // Get top recommendations
  const topMatches = scoredDoctors.filter(d => d.speciality === speciality);
  const alternativeMatches = scoredDoctors.filter(d => alternativeSpecialities.includes(d.speciality));
  const generalPhysicians = scoredDoctors.filter(d => 
    (d.speciality === 'General physician' || d.speciality === 'General Physician') && 
    !topMatches.some(t => t._id.toString() === d._id.toString())
  );

  // Prioritize: exact match > alternative > general physician > top scored
  if (topMatches.length > 0) {
    recommended.push(...topMatches.slice(0, 5));
  } else if (alternativeMatches.length > 0) {
    recommended.push(...alternativeMatches.slice(0, 5));
  } else if (generalPhysicians.length > 0) {
    recommended.push(...generalPhysicians.slice(0, 5));
  } else {
    // Fallback: return top 5 scored doctors regardless of speciality
    recommended.push(...scoredDoctors.slice(0, 5));
  }

  // Remove duplicates and limit to 5
  const uniqueDoctors = [];
  const seenIds = new Set();
  for (const doctor of recommended) {
    if (!seenIds.has(doctor._id.toString())) {
      uniqueDoctors.push(doctor);
      seenIds.add(doctor._id.toString());
      if (uniqueDoctors.length >= 5) break;
    }
  }

  return uniqueDoctors;
}

// Get speciality for a disease
export const getSpecialityForDisease = (disease) => {
  const normalized = normalizeSymptom(disease);
  const info = diseaseSpecialityMap[normalized] || { 
    speciality: 'General physician', 
    priority: 3, 
    alternative: [] 
  };
  return info;
}

