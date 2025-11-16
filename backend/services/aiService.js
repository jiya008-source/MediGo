import Groq from 'groq-sdk';

// Initialize Groq client
let groq;
try {
  groq = new Groq({
    apiKey: process.env.AI_API_KEY,
  });
} catch (error) {
  console.error('Failed to initialize Groq client:', error);
}

/**
 * Get specialization based on symptoms (fallback logic)
 */
const getSpecializationFromSymptoms = (symptoms) => {
  const symptomsLower = symptoms.toLowerCase();
  
  // Rule-based mapping (matching the Doctors page specializations)
  if (symptomsLower.includes('fever') || symptomsLower.includes('cold') || symptomsLower.includes('cough')) {
    return 'General physician';
  }
  if (symptomsLower.includes('chest pain') || symptomsLower.includes('chest')) {
    return 'Cardiologist';
  }
  if (symptomsLower.includes('skin') || symptomsLower.includes('rash') || symptomsLower.includes('dermatitis')) {
    return 'Dermatologist';
  }
  if (symptomsLower.includes('ear') || symptomsLower.includes('hearing')) {
    return 'ENT';
  }
  if (symptomsLower.includes('stomach') || symptomsLower.includes('abdominal') || symptomsLower.includes('digestive')) {
    return 'Gastroenterologist';
  }
  if (symptomsLower.includes('eye') || symptomsLower.includes('vision') || symptomsLower.includes('sight')) {
    return 'Ophthalmologist';
  }
  if (symptomsLower.includes('diabetes') || symptomsLower.includes('thyroid') || symptomsLower.includes('hormone')) {
    return 'Endocrinologist';
  }
  if (symptomsLower.includes('back pain') || symptomsLower.includes('back') || symptomsLower.includes('spine')) {
    return 'Orthopedic';
  }
  
  // Default fallback
  return 'General physician';
};

/**
 * Diagnose symptoms using Groq AI
 */
export const diagnoseSymptoms = async (symptoms) => {
  try {
    if (!process.env.AI_API_KEY || !process.env.AI_MODEL) {
      throw new Error('AI configuration missing. Please check environment variables.');
    }

    if (!groq) {
      throw new Error('Groq client not initialized.');
    }

    const systemPrompt = `You are a medical AI assistant. Analyze the patient's symptoms and provide a diagnosis in the following JSON format ONLY. Do not include any text outside the JSON structure.

{
  "condition": "Name of the most likely condition",
  "specialization": "Medical specialization needed (e.g., General physician, Cardiologist, Dermatologist, ENT, Gastroenterologist, Ophthalmologist, Endocrinologist, Orthopedic, Neurologist, Gynecologist, Pediatricians)",
  "advice": "Brief medical advice (2-3 sentences)",
  "confidence": "High/Medium/Low"
}

Rules:
1. Return ONLY valid JSON, no markdown, no code blocks
2. Specialization must be one of: General physician, Cardiologist, Dermatologist, ENT, Gastroenterologist, Ophthalmologist, Endocrinologist, Orthopedic, Neurologist, Gynecologist, Pediatricians
3. Confidence should be High (if very certain), Medium (if somewhat certain), or Low (if uncertain)
4. Be conservative with diagnoses - if uncertain, suggest General physician
5. Do not provide treatment recommendations, only diagnosis and advice`;

    const userPrompt = `Patient symptoms: ${symptoms}\n\nAnalyze these symptoms and provide the diagnosis in the required JSON format.`;

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: userPrompt,
        },
      ],
      model: process.env.AI_MODEL,
      temperature: 0.3,
      max_tokens: 500,
    });

    const responseText = completion.choices[0]?.message?.content || '';
    
    // Parse JSON response
    let diagnosis;
    try {
      // Remove markdown code blocks if present
      const cleanedResponse = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      diagnosis = JSON.parse(cleanedResponse);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      // Fallback to rule-based specialization
      return {
        condition: 'Unable to determine specific condition',
        specialization: getSpecializationFromSymptoms(symptoms),
        advice: 'Please consult a doctor for proper diagnosis and treatment.',
        confidence: 'Low',
      };
    }

    // Validate and sanitize response
    if (!diagnosis.condition || !diagnosis.specialization) {
      diagnosis.specialization = diagnosis.specialization || getSpecializationFromSymptoms(symptoms);
    }

    // Ensure specialization is valid (normalize to match Doctors page)
    const validSpecializations = [
      'General physician',
      'Cardiologist',
      'Dermatologist',
      'ENT',
      'Gastroenterologist',
      'Ophthalmologist',
      'Endocrinologist',
      'Orthopedic',
      'Neurologist',
      'Gynecologist',
      'Pediatricians',
    ];
    
    // Normalize common variations
    if (diagnosis.specialization === 'General Physician') {
      diagnosis.specialization = 'General physician';
    }

    if (!validSpecializations.includes(diagnosis.specialization)) {
      diagnosis.specialization = getSpecializationFromSymptoms(symptoms);
    }

    // Ensure confidence is valid
    if (!['High', 'Medium', 'Low'].includes(diagnosis.confidence)) {
      diagnosis.confidence = 'Medium';
    }

    return {
      condition: diagnosis.condition || 'Unable to determine specific condition',
      specialization: diagnosis.specialization || getSpecializationFromSymptoms(symptoms),
      advice: diagnosis.advice || 'Please consult a doctor for proper diagnosis and treatment.',
      confidence: diagnosis.confidence || 'Medium',
    };
  } catch (error) {
    console.error('AI Service Error:', error);
    
    // Fallback to rule-based specialization
    return {
      condition: 'Unable to determine specific condition',
      specialization: getSpecializationFromSymptoms(symptoms),
      advice: 'Please consult a doctor for proper diagnosis and treatment. The AI service encountered an error.',
      confidence: 'Low',
    };
  }
};

