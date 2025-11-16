import React, { useState, useRef, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { AppContext } from '../context/AppContext'
import { toast } from 'react-toastify'

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      text: 'Hello! I\'m your health assistant. Please describe your symptoms and I\'ll help you find the right doctor. For example, you can say "I have fever, cough, and headache".'
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [suggestedDoctors, setSuggestedDoctors] = useState([])
  const messagesEndRef = useRef(null)
  const { backendUrl, doctors } = useContext(AppContext)
  const navigate = useNavigate()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const extractSymptoms = (text) => {
    // Comprehensive symptom keywords with variations
    const symptomKeywords = [
      // Fever and general
      'fever', 'temperature', 'high temperature', 'chills', 'sweating',
      // Head and neurological
      'headache', 'head ache', 'migraine', 'dizziness', 'vertigo',
      'sensitivity to light', 'sensitivity to sound', 'light sensitivity', 'sound sensitivity',
      // Respiratory
      'cough', 'coughing', 'sore throat', 'runny nose', 'sneezing', 'nasal congestion',
      'post nasal drip', 'shortness of breath', 'breathing difficulty', 'wheezing',
      'chest pain', 'chest tightness', 'phlegm', 'mucus',
      // Stomach and digestive
      'stomach pain', 'abdominal pain', 'belly pain', 'nausea', 'vomiting', 'throwing up',
      'diarrhea', 'diarrhoea', 'constipation', 'gas', 'bloating', 'indigestion',
      'heartburn', 'acid reflux', 'right lower abdominal pain',
      // Skin
      'rash', 'itching', 'itchy', 'redness', 'swelling', 'hives', 'dry skin',
      'scaly patches', 'skin infection', 'dermatitis',
      // Musculoskeletal
      'joint pain', 'muscle pain', 'back pain', 'neck pain', 'shoulder pain',
      'stiffness', 'tenderness', 'reduced range of motion',
      // Other
      'fatigue', 'tiredness', 'body ache', 'body pain', 'eye pain', 'tearing',
      'facial pain', 'ear pain', 'toothache', 'bleeding'
    ]

    const lowerText = text.toLowerCase()
    const foundSymptoms = []
    const textWords = lowerText.split(/[,\s.]+/).filter(w => w.length > 2)

    // Direct keyword matching
    symptomKeywords.forEach(symptom => {
      if (lowerText.includes(symptom.toLowerCase())) {
        const normalized = symptom.replace(/\s+/g, '_')
        if (!foundSymptoms.includes(normalized)) {
          foundSymptoms.push(normalized)
        }
      }
    })

    // Extract symptoms from common phrases
    const symptomPhrases = [
      { pattern: /i have (.+?)(?:,|\.|$)/gi, extract: true },
      { pattern: /i'm experiencing (.+?)(?:,|\.|$)/gi, extract: true },
      { pattern: /i am experiencing (.+?)(?:,|\.|$)/gi, extract: true },
      { pattern: /symptoms? (?:are|include|is) (.+?)(?:,|\.|$)/gi, extract: true }
    ]

    symptomPhrases.forEach(({ pattern, extract }) => {
      const matches = lowerText.matchAll(pattern)
      for (const match of matches) {
        if (match[1]) {
          const symptoms = match[1].split(/[,\s]+and\s+/).map(s => s.trim())
          symptoms.forEach(symptom => {
            symptomKeywords.forEach(keyword => {
              if (symptom.includes(keyword) || keyword.includes(symptom)) {
                const normalized = keyword.replace(/\s+/g, '_')
                if (!foundSymptoms.includes(normalized)) {
                  foundSymptoms.push(normalized)
                }
              }
            })
          })
        }
      }
    })

    // If no symptoms found, try to infer from common words
    if (foundSymptoms.length === 0) {
      const commonMappings = {
        'hot': 'fever',
        'cold': 'cough',
        'ache': 'body ache',
        'hurts': 'pain',
        'sick': 'nausea'
      }
      
      textWords.forEach(word => {
        Object.entries(commonMappings).forEach(([key, symptom]) => {
          if (word.includes(key)) {
            const normalized = symptom.replace(/\s+/g, '_')
            if (!foundSymptoms.includes(normalized)) {
              foundSymptoms.push(normalized)
            }
          }
        })
      })
    }

    return foundSymptoms.length > 0 ? foundSymptoms : []
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return

    const userMessage = inputValue.trim()
    setInputValue('')
    
    // Add user message
    setMessages(prev => [...prev, { type: 'user', text: userMessage }])
    setIsLoading(true)

    // Check if backendUrl is configured
    if (!backendUrl) {
      console.error('ERROR: backendUrl is undefined!')
      setMessages(prev => [...prev, {
        type: 'bot',
        text: 'Configuration error: Backend URL is not set. Please check your environment variables.'
      }])
      setIsLoading(false)
      toast.error('Backend URL not configured')
      return
    }

    try {
      // Call new AI diagnosis API
      const response = await axios.post(`${backendUrl}/api/ai/diagnose`, {
        symptoms: userMessage
      })

      const { data } = response

      if (data && data.success && data.data) {
        const { condition, specialization, advice, confidence } = data.data
        
        // Format bot response
        let botMessage = `Based on your symptoms, I've analyzed your condition.\n\n`
        botMessage += `**Condition:** ${condition}\n`
        botMessage += `**Recommended Specialization:** ${specialization}\n`
        botMessage += `**Confidence Level:** ${confidence}\n\n`
        botMessage += `**Advice:** ${advice}\n\n`
        botMessage += `Here are the best matching doctors for your condition:`

        setMessages(prev => [...prev, { type: 'bot', text: botMessage }])
        
        // Get doctors matching the specialization (case-insensitive)
        const matchingDoctors = (doctors || []).filter(doc => {
          const docSpeciality = (doc.speciality || '').trim()
          const targetSpeciality = (specialization || '').trim()
          return docSpeciality.toLowerCase() === targetSpeciality.toLowerCase()
        }).slice(0, 5)

        // If no exact match, show General physicians as fallback
        const doctorsToShow = matchingDoctors.length > 0 
          ? matchingDoctors 
          : (doctors || []).filter(doc => {
              const docSpeciality = (doc.speciality || '').trim().toLowerCase()
              return docSpeciality === 'general physician'
            }).slice(0, 5)

        setSuggestedDoctors(doctorsToShow)

        if (doctorsToShow.length > 0) {
          // Add doctor suggestions
          doctorsToShow.forEach((doctor, index) => {
            setTimeout(() => {
              setMessages(prev => [...prev, {
                type: 'doctor',
                doctor: doctor,
                text: `${doctor.name} - ${doctor.speciality}\n${doctor.speciality?.toLowerCase() === specialization?.toLowerCase() ? 'Perfect match for your condition' : 'Recommended doctor'}${doctor.experience ? ` • ${doctor.experience} years experience` : ''}`
              }])
            }, (index + 1) * 300)
          })
        } else {
          setMessages(prev => [...prev, {
            type: 'bot',
            text: 'No doctors found for this speciality. Please try consulting a General Physician or contact support.'
          }])
        }
      } else {
        setMessages(prev => [...prev, {
          type: 'bot',
          text: data?.message || 'I apologize, but I couldn\'t process your symptoms. Please try describing them differently or consult a General Physician.'
        }])
        toast.error(data?.message || 'Failed to get diagnosis')
      }
    } catch (error) {
      console.error('API Error Details:', error)
      console.error('Error Response:', error.response?.data)
      console.error('Error Status:', error.response?.status)
      setMessages(prev => [...prev, {
        type: 'bot',
        text: `Sorry, I encountered an error: ${error.response?.data?.message || error.message || 'Unknown error'}. Please try again or consult a doctor directly.`
      }])
      toast.error(error.response?.data?.message || error.message || 'Error processing symptoms')
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleDoctorClick = (doctorId) => {
    navigate(`/appointment/${doctorId}`)
    setIsOpen(false)
  }

  const handleReset = () => {
    setMessages([
      {
        type: 'bot',
        text: 'Hello! I\'m your health assistant. Please describe your symptoms and I\'ll help you find the right doctor. For example, you can say "I have fever, cough, and headache".'
      }
    ])
    setSuggestedDoctors([])
  }

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className='fixed bottom-6 right-6 w-16 h-16 bg-primary text-white rounded-full shadow-lg hover:bg-primary/90 transition-all flex items-center justify-center z-50'
          aria-label="Open chatbot"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className='fixed bottom-6 right-6 w-96 h-[600px] bg-white rounded-lg shadow-2xl flex flex-col z-50 border border-gray-200'>
          {/* Header */}
          <div className='bg-primary text-white p-4 rounded-t-lg flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              <h3 className='font-semibold'>Health Assistant</h3>
            </div>
            <div className='flex items-center gap-2'>
              <button
                onClick={handleReset}
                className='p-1 hover:bg-white/20 rounded transition-all'
                aria-label="Reset chat"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className='p-1 hover:bg-white/20 rounded transition-all'
                aria-label="Close chatbot"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className='flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50'>
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.type === 'user'
                      ? 'bg-primary text-white'
                      : message.type === 'doctor'
                      ? 'bg-green-100 border border-green-300 cursor-pointer hover:bg-green-200'
                      : 'bg-white border border-gray-200 text-gray-800'
                  }`}
                  onClick={message.type === 'doctor' ? () => handleDoctorClick(message.doctor._id) : undefined}
                >
                  {message.type === 'doctor' ? (
                    <div>
                      <p className='font-semibold text-green-800'>{message.doctor.name}</p>
                      <p className='text-sm text-green-700'>{message.doctor.speciality}</p>
                      <p className='text-xs text-green-600 mt-1'>Click to book appointment</p>
                    </div>
                  ) : (
                    <p className='text-sm whitespace-pre-wrap'>{message.text}</p>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className='flex justify-start'>
                <div className='bg-white border border-gray-200 rounded-lg p-3'>
                  <div className='flex gap-1'>
                    <div className='w-2 h-2 bg-gray-400 rounded-full animate-bounce' style={{ animationDelay: '0ms' }}></div>
                    <div className='w-2 h-2 bg-gray-400 rounded-full animate-bounce' style={{ animationDelay: '150ms' }}></div>
                    <div className='w-2 h-2 bg-gray-400 rounded-full animate-bounce' style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className='p-4 border-t border-gray-200 bg-white rounded-b-lg'>
            <div className='flex gap-2'>
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Describe your symptoms..."
                className='flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm'
                disabled={isLoading}
              />
              <button
                onClick={handleSendMessage}
                disabled={isLoading || !inputValue.trim()}
                className='bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed'
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
            <p className='text-xs text-gray-500 mt-2'>Example: "I have fever, cough, and headache"</p>
          </div>
        </div>
      )}
    </>
  )
}

export default Chatbot

