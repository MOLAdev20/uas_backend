import StudentRoutes from '../controllers/Student.js'

import express from 'express'
const routes = express()

routes.use("/student", StudentRoutes)

export default routes