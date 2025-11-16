import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

const authUser = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) return res.status(401).json({ success: false, message: 'Unauthorized: No token' })
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = { id: decoded.id }
    next()
  } catch (error) {
    res.status(401).json({ success: false, message: 'Unauthorized: Invalid token' })
  }
}

export default authUser
