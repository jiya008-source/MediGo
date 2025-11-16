import validator from 'validator'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { v2 as cloudinary } from 'cloudinary'
import userModel from '../models/userModel.js'
import doctorModel from '../models/doctorModel.js'
import appointmentModel from '../models/appointmentModel.js'
import dotenv from 'dotenv';
dotenv.config();

const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone, gender, address, dob } = req.body
    if (!name || !password || !email || !phone || !gender || !dob) return res.json({ success: false, message: 'Missing Details' })
    if (!validator.isEmail(email)) return res.json({ success: false, message: 'Enter a valid email' })
    if (password.length < 8) return res.json({ success: false, message: 'Enter a strong password' })
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)
    const user = await new userModel({ 
      name, 
      email, 
      password: hashedPassword, 
      phone: phone || '00000000000',
      gender: gender || 'Not Selected',
      address: address || { line1: '', line2: '' },
      dob: dob || 'Not Selected'
    }).save()
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
    res.json({ success: true, token })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await userModel.findOne({ email })
    if (!user) return res.json({ success: false, message: 'User does not exist' })
    const isMatch = await bcrypt.compare(password, user.password)
    if (isMatch) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
      res.json({ success: true, token })
    } else {
      res.json({ success: false, message: 'Invalid Credentials' })
    }
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

const getProfile = async (req, res) => {
  try {
    const userData = await userModel.findById(req.user.id).select('-password')
    res.json({ success: true, userData })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

const updateProfile = async (req, res) => {
  try {
    const { name, phone, address, dob, gender } = req.body
    const imageFile = req.file
    if (!name || !phone || !dob || !gender) return res.json({ success: false, message: 'Data Missing' })
    await userModel.findByIdAndUpdate(req.user.id, { name, phone, address: JSON.parse(address), dob, gender })
    if (imageFile) {
      const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: 'image' })
      await userModel.findByIdAndUpdate(req.user.id, { image: imageUpload.secure_url })
    }
    res.json({ success: true, message: 'Profile Updated' })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

const bookAppointment = async (req, res) => {
  try {
    const { docId, slotDate, slotTime } = req.body
    const userId = req.user.id
    const docData = await doctorModel.findById(docId).select('-password')
    if (!docData) return res.json({ success: false, message: 'Doctor not found' })
    if (!docData.available) return res.json({ success: false, message: 'Doctor not available' })
    const slots_booked = docData.slots_booked || {}
    if (slots_booked[slotDate]?.includes(slotTime)) {
      return res.json({ success: false, message: 'Slot not available' })
    }
    slots_booked[slotDate] = [...(slots_booked[slotDate] || []), slotTime]
    const userData = await userModel.findById(userId).select('-password')
    const appointment = new appointmentModel({
      userId,
      docId,
      userData,
      docData: {
        _id: docData._id,
        name: docData.name,
        image: docData.image,
        specialization: docData.specialization,
        fees: docData.fees,
        gender: docData.gender
      },
      amount: docData.fees,
      slotTime,
      slotDate,
      date: new Date()
    })
    await appointment.save()
    await doctorModel.findByIdAndUpdate(docId, { slots_booked })
    res.json({ success: true, message: 'Appointment Booked' })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

const listAppointment = async (req, res) => {
  try {
    const appointments = await appointmentModel.find({ userId: req.user.id })
    res.json({ success: true, appointments })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

const cancelAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.body
    const userId = req.user.id
    const appointment = await appointmentModel.findById(appointmentId)
    if (appointment.userId.toString() !== userId) return res.json({ success: false, message: 'Unauthorized action' })
    await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true })
    const doctor = await doctorModel.findById(appointment.docId)
    doctor.slots_booked[appointment.slotDate] = doctor.slots_booked[appointment.slotDate].filter(slot => slot !== appointment.slotTime)
    await doctorModel.findByIdAndUpdate(appointment.docId, { slots_booked: doctor.slots_booked })
    res.json({ success: true, message: 'Appointment Cancelled' })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

export { registerUser, loginUser, getProfile, updateProfile, bookAppointment, listAppointment, cancelAppointment }
