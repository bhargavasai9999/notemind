import express from 'express'
import { authorizeUser } from '../middlewares/authorizeUser.js'
import { createNote, getNotes, updateNote } from '../controllers/notesController.js'

const router=express.Router()



router.post('/createnote',authorizeUser,createNote)
router.put('/updatenote/:id',authorizeUser,updateNote)
router.get('/noteslist',authorizeUser,getNotes)

export const NotesRouters=router
