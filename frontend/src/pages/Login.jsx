import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const Login = () => {
  const { backendUrl, token, setToken } = useContext(AppContext)
  const navigate = useNavigate()
  const [state, setState] = useState('Sign Up')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [gender, setGender] = useState('Not Selected')
  const [addressLine1, setAddressLine1] = useState('')
  const [addressLine2, setAddressLine2] = useState('')
  const [dob, setDob] = useState('')

  const onSubmitHandler = async (e) => {
    e.preventDefault()

    try {
      let res
      if (state === 'Sign Up') {
        const address = { line1: addressLine1, line2: addressLine2 }
        res = await axios.post(backendUrl + '/api/user/register', { 
          name, 
          password, 
          email, 
          phone, 
          gender, 
          address, 
          dob 
        })
      } else {
        res = await axios.post(backendUrl + '/api/user/login', { email, password })
      }

      const data = res.data
      if (data.success) {
        localStorage.setItem('token', data.token)
        setToken(data.token)
        toast.success(state === 'Sign Up' ? 'Account created!' : 'Login successful')
        navigate('/')
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    if (token) navigate('/')
  }, [token])

  return (
    <form onSubmit={onSubmitHandler} className='min-h-[80vh] flex items-center'>
      <div className='flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-zinc-600 text-sm shadow-lg'>
        <p className='text-2xl font-semibold'>{state === 'Sign Up' ? 'Create Account' : 'Login'}</p>
        <p>Please {state === 'Sign Up' ? 'sign up' : 'log in'} to book appointment</p>

        {state === 'Sign Up' && (
          <>
            <div className='w-full'>
              <p>Full Name</p>
              <input className='border border-zinc-300 rounded w-full p-2 mt-1' type="text" onChange={(e) => setName(e.target.value)} value={name} required />
            </div>

            <div className='w-full'>
              <p>Phone Number</p>
              <input className='border border-zinc-300 rounded w-full p-2 mt-1' type="tel" onChange={(e) => setPhone(e.target.value)} value={phone} required />
            </div>

            <div className='w-full'>
              <p>Gender</p>
              <select className='border border-zinc-300 rounded w-full p-2 mt-1' onChange={(e) => setGender(e.target.value)} value={gender} required>
                <option value="Not Selected">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className='w-full'>
              <p>Date of Birth</p>
              <input className='border border-zinc-300 rounded w-full p-2 mt-1' type="date" onChange={(e) => setDob(e.target.value)} value={dob} required />
            </div>

            <div className='w-full'>
              <p>Address Line 1</p>
              <input className='border border-zinc-300 rounded w-full p-2 mt-1' type="text" onChange={(e) => setAddressLine1(e.target.value)} value={addressLine1} required />
            </div>

            <div className='w-full'>
              <p>Address Line 2</p>
              <input className='border border-zinc-300 rounded w-full p-2 mt-1' type="text" onChange={(e) => setAddressLine2(e.target.value)} value={addressLine2} />
            </div>
          </>
        )}

        <div className='w-full'>
          <p>Email</p>
          <input className='border border-zinc-300 rounded w-full p-2 mt-1' type="email" onChange={(e) => setEmail(e.target.value)} value={email} required />
        </div>

        <div className='w-full'>
          <p>Password</p>
          <input className='border border-zinc-300 rounded w-full p-2 mt-1' type="password" onChange={(e) => setPassword(e.target.value)} value={password} required />
        </div>

        <button type='submit' className='bg-primary text-white w-full py-2 rounded-md text-base'>{state === 'Sign Up' ? 'Create Account' : 'Login'}</button>

        {state === 'Sign Up' ? (
          <p>Already have an account? <span onClick={() => setState('Login')} className='text-primary underline cursor-pointer'>Login here</span></p>
        ) : (
          <p>Create an account? <span onClick={() => setState('Sign Up')} className='text-primary underline cursor-pointer'>Click here</span></p>
        )}
      </div>
    </form>
  )
}

export default Login
