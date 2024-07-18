import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { checkDBConnection } from './config/database.js'
import { AuthRouters } from './routes/authRouter.js'
import { NotesRouters } from './routes/notesRouter.js'
import { LabelRouters } from './routes/labelsRouter.js'
import path from 'path'
import { authorizeUser } from './middlewares/authorizeUser.js'

dotenv.config()

const PORT=process.env.PORT || 5000
const app = express()
app.use(express.static(path.join('../frontend')))
app.use(express.json())
app.use(cors())


await checkDBConnection()

app.use('/api/auth',AuthRouters)
app.use('/api/notes',NotesRouters)
app.use('/api/labels',LabelRouters)

app.get('/', (req, res) => {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) {
      return res.sendFile(path.join('../frontend/auth.html'))
    }
    try {
      const userId = verifyTokenAndGetUserId(token)
      req.userId = userId
      return res.sendFile(path.join( '../frontend/index.html'))
    } catch (err) {
      return res.sendFile(path.join( '../frontend/auth.html'))
    }
  })


app.listen(PORT,()=>{
    console.log(`SERVER is Running at PORT ${PORT}`)
})

