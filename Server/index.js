// lib & middle
import express from "express"
import dotenv from "dotenv"
import mongoose from "mongoose"
import cors from "cors"
import YAML from 'yamljs'
import { Server } from 'socket.io'
import http from 'http'
import session from "express-session"
import swaggerUi from 'swagger-ui-express'
import { verifyAdmin, verifyToken } from "./middleware/verify.js"
import { clearTokenList } from "./service/jwt.js"
// import { NOTIFY_EVENT, SESSION_AGE } from "./constant.js"
// import { addSocketSession, handleDisconnect, sendNotify } from "./socket/handle.js"
import helmet from "helmet"
import morgan from "morgan"
import compression from "compression"
import { checkOverload } from "./helper/checkConnectdb.js"
import { SESSION_AGE } from "./constant.js"
import adminRoute from "./router/admin/index.js"
import TaiKhoanRoute from "./router/TaiKhoan.js"

const swaggerDocument = YAML.load('./swagger.yaml')

dotenv.config()

/**
 * Connect MongoDB
*/
mongoose.connect(process.env.MONGO_URI, { maxPoolSize: 100 })
const db = mongoose.connection
db.on('error', () => console.log('MongoDB connection error.'))
db.once('open', () => {
    console.log('Connected to MongoDB successfully.')
})
checkOverload()

const PORT = process.env.PORT || 8000
export const TOKEN_LIST = {}
export const TOKEN_BLACKLIST = {}
export const SOCKET_SESSIONS = []
const app = express()

const store = new session.MemoryStore()

app.use(session({
    secret: process.env.SESSION_NAME,
    cookie: { maxAge: SESSION_AGE },
    saveUninitialized: false,
    store,
    resave: false
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cors(
    {
        origin: 'http://localhost:3000',
        credentials: true
    }
))
app.use(morgan("dev"))
app.use(compression())
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));


app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
    .use('/api/admin', adminRoute)
    .use('/api/tai-khoan', TaiKhoanRoute)

app.use('/*', async (req, res) => {
    res.status(200).send("Don't implement.")
})

app.listen(PORT, () => {
    console.log(`Server start at port: ${PORT}`)
})

