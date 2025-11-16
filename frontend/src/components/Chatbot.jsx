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
  const { backendUrl } = useContext(AppContext)
  const navigate = useNavigate()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const extractSymptoms = (text) => {
    // Common symptom keywords
    const symptomKeywords = [
      'fever', 'headache', 'cough', 'sore throat', 'runny nose', 'sneezing',
      'body ache', 'fatigue', 'chills', 'nausea', 'vomiting', 'diarrhea',
      'stomach pain', 'abdominal pain', 'chest pain', 'shortness of breath',
      'wheezing', 'rash', 'itching', 'joint pain', 'muscle pain', 'back pain',
      'dizziness', 'blurred vision', 'ear pain', 'toothache', 'swelling',
      'bleeding', 'constipation', 'gas', 'bloating', 'indigestion',
      'sensitivity to light', 'sensitivity to sound', 'nasal congestion',
      'post nasal drip', 'facial pain', 'neck pain', 'shoulder pain',
      'phlegm', 'chest tightness', 'stiffness', 'redness', 'dry skin',
      'scaly patches', 'hives', 'swelling'
    ]

    const lowerText = text.toLowerCase()
    const foundSymptoms = []

    symptomKeywords.forEach(symptom => {
      if (lowerText.includes(symptom)) {
        foundSymptoms.push(symptom.replace(/\s+/g, '_'))
      }
    })

    // Also check for common phrases
    if (lowerText.includes('i have') || lowerText.includes('i am experiencing') || lowerText.includes('symptoms')) {
      // Try to extract symptoms from the text
      const words = text.toLowerCase().split(/[,\s]+/)
      words.forEach(word => {
        if (word.length > 3 && !foundSymptoms.includes(word.replace(/\s+/g, '_'))) {
          // Check if it's a known symptom variation
          symptomKeywords.forEach(keyword => {
            if (keyword.includes(word) || word.includes(keyword)) {
              if (!foundSymptoms.includes(keyword.replace(/\s+/g, '_'))) {
                foundSymptoms.push(keyword.replace(/\s+/g, '_'))
              }
            }
          })
        }
      })
    }

    return foundSymptoms.length > 0 ? foundSymptoms : ['fever'] // Default to fever if no symptoms found
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return

    const userMessage = inputValue.trim()
    setInputValue('')
    
    // Add user message
    setMessages(prev => [...prev, { type: 'user', text: userMessage }])
    setIsLoading(true)

    try {
      // Extract symptoms from user message
      const symptoms = extractSymptoms(userMessage)
      
      // Call API to predict disease
      const { data } = await axios.post(backendUrl + '/api/symptom/predict', {
        symptoms
      })

      if (data.success) {
        const { prediction, suggestedDoctors: doctors } = data
        
        // Add bot response
        let botMessage = prediction.message || 'Based on your symptoms, I recommend consulting a doctor.'
        
        if (prediction.disease) {
          botMessage = `Based on your symptoms, you might have **${prediction.disease}** (${prediction.confidence}% confidence).\n\nI recommend consulting a **${prediction.suggestedSpeciality}**.\n\nHere are some available doctors:`
        }

        setMessages(prev => [...prev, { type: 'bot', text: botMessage }])
        setSuggestedDoctors(doctors || [])

        if (doctors && doctors.length > 0) {
          // Add doctor suggestions as messages
          doctors.forEach((doctor, index) => {
            setTimeout(() => {
              setMessages(prev => [...prev, {
                type: 'doctor',
                doctor: doctor,
                text: `${doctor.name} - ${doctor.speciality}`
              }])
            }, (index + 1) * 300)
          })
        }
      } else {
        setMessages(prev => [...prev, {
          type: 'bot',
          text: 'I apologize, but I couldn\'t process your symptoms. Please try describing them differently or consult a General Physician.'
        }])
      }
    } catch (error) {
      console.error('Error:', error)
      setMessages(prev => [...prev, {
        type: 'bot',
        text: 'Sorry, I encountered an error. Please try again or consult a doctor directly.'
      }])
      toast.error('Error processing symptoms')
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

