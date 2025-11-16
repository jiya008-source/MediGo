import React, { useState, useRef, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';

const AIChatbot = () => {
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      text: 'Hello! I\'m your AI health assistant. Please describe your symptoms and I\'ll help you get a diagnosis and find the right specialist. For example, you can say "I have fever, headache, and cough".',
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [diagnosis, setDiagnosis] = useState(null);
  const messagesEndRef = useRef(null);
  const { backendUrl, doctors } = useContext(AppContext);
  const navigate = useNavigate();

  // Debug: Log on component mount
  useEffect(() => {
    console.log('AIChatbot component mounted');
    console.log('backendUrl from context:', backendUrl);
    console.log('VITE_BACKEND_URL from env:', import.meta.env.VITE_BACKEND_URL);
  }, [backendUrl]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    console.log('=== handleSendMessage called ===');
    console.log('inputValue:', inputValue);
    console.log('isLoading:', isLoading);
    
    if (!inputValue.trim() || isLoading) {
      console.log('Early return: inputValue empty or isLoading');
      return;
    }

    const userMessage = inputValue.trim();
    console.log('Processing message:', userMessage);
    setInputValue('');

    // Add user message
    setMessages((prev) => [...prev, { type: 'user', text: userMessage }]);
    setIsLoading(true);

    // Debug: Check backendUrl
    console.log('=== AI Chatbot Debug ===');
    console.log('backendUrl from context:', backendUrl);
    console.log('userMessage:', userMessage);
    console.log('Full API URL:', `${backendUrl}/api/ai/diagnose`);

    if (!backendUrl) {
      console.error('ERROR: backendUrl is undefined!');
      setMessages((prev) => [
        ...prev,
        {
          type: 'bot',
          text: 'Configuration error: Backend URL is not set. Please check your environment variables.',
        },
      ]);
      setIsLoading(false);
      toast.error('Backend URL not configured');
      return;
    }

    try {
      // Call AI diagnosis API
      console.log('Making API call to:', `${backendUrl}/api/ai/diagnose`);
      const response = await axios.post(`${backendUrl}/api/ai/diagnose`, {
        symptoms: userMessage,
      });
      
      console.log('Full response object:', response);
      const { data } = response;

      console.log('API Response data:', data);
      console.log('data.success:', data.success);
      console.log('data.data:', data.data);

      if (data && data.success && data.data) {
        const { condition, specialization, advice, confidence } = data.data;
        setDiagnosis(data.data);

        // Format bot response
        let botMessage = `Based on your symptoms, I've analyzed your condition.\n\n`;
        botMessage += `**Condition:** ${condition}\n`;
        botMessage += `**Recommended Specialization:** ${specialization}\n`;
        botMessage += `**Confidence Level:** ${confidence}\n\n`;
        botMessage += `**Advice:** ${advice}\n\n`;
        botMessage += `Here are the best matching doctors for your condition:`;

        setMessages((prev) => [...prev, { type: 'bot', text: botMessage, diagnosis: data.data }]);

        // Get doctors matching the specialization (case-insensitive)
        console.log('Available doctors:', doctors);
        console.log('Looking for specialization:', specialization);
        
        const matchingDoctors = (doctors || []).filter(doc => {
          const docSpeciality = (doc.speciality || '').trim();
          const targetSpeciality = (specialization || '').trim();
          return docSpeciality.toLowerCase() === targetSpeciality.toLowerCase();
        }).slice(0, 5);

        // If no exact match, show General physicians as fallback
        const doctorsToShow = matchingDoctors.length > 0 
          ? matchingDoctors 
          : (doctors || []).filter(doc => {
              const docSpeciality = (doc.speciality || '').trim().toLowerCase();
              return docSpeciality === 'general physician';
            }).slice(0, 5);
        
        console.log('Matching doctors found:', doctorsToShow.length);

        if (doctorsToShow.length > 0) {
          // Add doctor suggestions with a delay for better UX
          doctorsToShow.forEach((doctor, index) => {
            setTimeout(() => {
              setMessages((prev) => [...prev, {
                type: 'doctor',
                doctor: doctor,
                text: `${doctor.name} - ${doctor.speciality}\n${doctor.speciality === specialization ? 'Perfect match for your condition' : 'Recommended doctor'}${doctor.experience ? ` • ${doctor.experience} years experience` : ''}`
              }]);
            }, (index + 1) * 300);
          });
        } else {
          setMessages((prev) => [...prev, {
            type: 'bot',
            text: 'No doctors found for this speciality. Please try consulting a General Physician or contact support.'
          }]);
        }
      } else {
        console.error('API returned success=false:', data);
        setMessages((prev) => [
          ...prev,
          {
            type: 'bot',
            text: data.message || 'I apologize, but I couldn\'t process your symptoms. Please try describing them differently or consult a General Physician.',
          },
        ]);
        toast.error(data.message || 'Failed to get diagnosis');
      }
    } catch (error) {
      console.error('API Error Details:', error);
      console.error('Error Response:', error.response?.data);
      console.error('Error Status:', error.response?.status);
      setMessages((prev) => [
        ...prev,
        {
          type: 'bot',
          text: `Sorry, I encountered an error: ${error.response?.data?.message || error.message || 'Unknown error'}. Please try again or consult a doctor directly.`,
        },
      ]);
      toast.error(error.response?.data?.message || error.message || 'Error processing symptoms');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleBookAppointment = () => {
    if (diagnosis?.specialization) {
      // Navigate to doctors page filtered by specialization
      navigate(`/doctors/${diagnosis.specialization}`);
    } else {
      navigate('/doctors');
    }
  };

  const handleReset = () => {
    setMessages([
      {
        type: 'bot',
        text: 'Hello! I\'m your AI health assistant. Please describe your symptoms and I\'ll help you get a diagnosis and find the right specialist. For example, you can say "I have fever, headache, and cough".',
      },
    ]);
    setDiagnosis(null);
  };

  return (
    <div className='min-h-[80vh] py-8'>
      <div className='max-w-4xl mx-auto'>
        {/* Header */}
        <div className='text-center mb-8'>
          <h1 className='text-3xl font-bold text-gray-900 mb-2'>AI Health Assistant</h1>
          <p className='text-gray-600'>Describe your symptoms and get AI-powered diagnosis recommendations</p>
        </div>

        {/* Chat Container */}
        <div className='bg-white rounded-lg shadow-lg border border-gray-200 flex flex-col h-[600px]'>
          {/* Chat Header */}
          <div className='bg-primary text-white p-4 rounded-t-lg flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z'
                />
              </svg>
              <h3 className='font-semibold text-lg'>AI Diagnosis Chat</h3>
            </div>
            <button
              onClick={handleReset}
              className='p-2 hover:bg-white/20 rounded transition-all'
              aria-label='Reset chat'
              title='Reset Chat'
            >
              <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15'
                />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className='flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50'>
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-4 ${
                    message.type === 'user'
                      ? 'bg-primary text-white'
                      : message.type === 'doctor'
                      ? 'bg-green-100 border border-green-300 cursor-pointer hover:bg-green-200'
                      : 'bg-white border border-gray-200 text-gray-800'
                  }`}
                  onClick={message.type === 'doctor' ? () => navigate(`/appointment/${message.doctor._id}`) : undefined}
                >
                  {message.type === 'doctor' ? (
                    <div>
                      <p className='font-semibold text-green-800'>{message.doctor.name}</p>
                      <p className='text-sm text-green-700'>{message.doctor.speciality}</p>
                      <p className='text-xs text-green-600 mt-1'>Click to book appointment</p>
                    </div>
                  ) : (
                    <>
                      <p className='text-sm whitespace-pre-wrap'>{message.text}</p>
                      {message.diagnosis && (
                        <div className='mt-3 pt-3 border-t border-gray-200'>
                          <div className='space-y-2 text-xs'>
                            <div className='flex items-center gap-2'>
                              <span className='font-semibold text-gray-700'>Condition:</span>
                              <span className='text-gray-600'>{message.diagnosis.condition}</span>
                            </div>
                            <div className='flex items-center gap-2'>
                              <span className='font-semibold text-gray-700'>Specialization:</span>
                              <span className='text-gray-600'>{message.diagnosis.specialization}</span>
                            </div>
                            <div className='flex items-center gap-2'>
                              <span className='font-semibold text-gray-700'>Confidence:</span>
                              <span
                                className={`px-2 py-1 rounded ${
                                  message.diagnosis.confidence === 'High'
                                    ? 'bg-green-100 text-green-800'
                                    : message.diagnosis.confidence === 'Medium'
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : 'bg-red-100 text-red-800'
                                }`}
                              >
                                {message.diagnosis.confidence}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className='flex justify-start'>
                <div className='bg-white border border-gray-200 rounded-lg p-3'>
                  <div className='flex gap-1'>
                    <div
                      className='w-2 h-2 bg-gray-400 rounded-full animate-bounce'
                      style={{ animationDelay: '0ms' }}
                    ></div>
                    <div
                      className='w-2 h-2 bg-gray-400 rounded-full animate-bounce'
                      style={{ animationDelay: '150ms' }}
                    ></div>
                    <div
                      className='w-2 h-2 bg-gray-400 rounded-full animate-bounce'
                      style={{ animationDelay: '300ms' }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className='p-4 border-t border-gray-200 bg-white rounded-b-lg'>
            <div className='flex gap-2 mb-2'>
              <input
                type='text'
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder='Describe your symptoms...'
                className='flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm'
                disabled={isLoading}
              />
              <button
                onClick={handleSendMessage}
                disabled={isLoading || !inputValue.trim()}
                className='bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium'
              >
                Send
              </button>
            </div>
            <p className='text-xs text-gray-500'>Example: "I have fever, headache, and cough"</p>

            {/* Book Appointment Button */}
            {diagnosis && (
              <div className='mt-4 pt-4 border-t border-gray-200'>
                <button
                  onClick={handleBookAppointment}
                  className='w-full bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-all font-semibold flex items-center justify-center gap-2'
                >
                  <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
                    />
                  </svg>
                  Book Appointment with a {diagnosis.specialization}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Info Section */}
        <div className='mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4'>
          <p className='text-sm text-blue-800'>
            <strong>Note:</strong> This AI assistant provides preliminary diagnosis suggestions only. Always consult
            with a qualified healthcare professional for proper medical diagnosis and treatment.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AIChatbot;

