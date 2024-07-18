import jwt from 'jsonwebtoken'

export const signJwtToken = (userId) => {
  return jwt.sign(
    {
      userId,
    },
    process.env.JWT_SECRET_KEY,
    { expiresIn: '2 days' }
  )
}

export const verifyTokenAndGetUserId = (token) => {
  const payload = jwt.verify(token, process.env.JWT_SECRET_KEY)
  return payload.userId
}
