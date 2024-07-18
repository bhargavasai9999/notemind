import { verifyTokenAndGetUserId } from '../utils/Jwt.js'

export const authorizeUser = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) {
    throw new Error('User Unauthorized')
  }
  try {
    const userId = verifyTokenAndGetUserId(token)
    req.userId = userId
    next()
  } catch (err) {
    console.log(err)
  }
}
