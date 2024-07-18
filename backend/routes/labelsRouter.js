import express from 'express'
import { authorizeUser } from '../middlewares/authorizeUser.js'
import { createLabel, getLabels, updateLabel } from '../controllers/labelsController.js'

const router=express.Router()


router.post('/createlabel',authorizeUser,createLabel)

router.put('/updatelabel/:id',authorizeUser,updateLabel)
router.get('/labelslist',authorizeUser,getLabels)

export const LabelRouters=router