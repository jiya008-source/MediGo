import express from 'express'
import { predictFromSymptoms } from '../controllers/symptomController.js'

const symptomRouter = express.Router()

symptomRouter.post('/predict', predictFromSymptoms)

export default symptomRouter

