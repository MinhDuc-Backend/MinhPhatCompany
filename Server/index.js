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
import { verifyAdmin, verifyToken, verifyUser } from "./middleware/verify.js"
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
import SinhVienRoute from "./router/SinhVien.js"
import GiangVienRoute from "./router/GiangVien.js"
import DangKyChuyenNganhRoute from "./router/DangKyChuyenNganh.js"
import KhoaLuanTotNghiepRoute from "./router/KhoaLuanTotNghiep.js"
import DangKyThucTapRoute from "./router/DangKyThucTap.js"

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
    secret: "hotrodaotao",
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
    .use('/api/admin', verifyToken, verifyAdmin, adminRoute)
    .use('/api/tai-khoan', TaiKhoanRoute)
    .use('/api/sinh-vien', verifyToken, verifyUser, SinhVienRoute)
    .use('/api/giang-vien',verifyToken, verifyUser, GiangVienRoute)
    .use('/api/dk-chuyen-nganh', DangKyChuyenNganhRoute)
    .use('/api/khoa-luan-tot-nghiep', KhoaLuanTotNghiepRoute)
    .use('/api/dk-thuc-tap', DangKyThucTapRoute)

app.use('/*', async (req, res) => {
    res.status(501).send("Don't implement.")
})
// const server = http.createServer(app);
// const io = new Server(server, {
//     cors: {
//         origin: "http://localhost:3000",
//         methods: ["GET", "POST", "PUT"]
//     }
// });
// const customers = {};

// io.on('connection', (socket) => {
//     console.log(`A user connected: ${socket.id}`);
//     //   Khi một khách hàng kết nối, thêm họ vào đối tượng customers
//     customers[socket.id] = 'Customer';

//     // Gửi thông báo cho admin rằng một khách hàng mới đã kết nối
//     io.emit('admin notification', `Admin: New customer (${socket.id}) connected.`);

//     socket.on('customer send', (message) => {
//         console.log("message:", message)
//         const data = {
//         customer: socket.id,
//         message: message
//         }
//         // Gửi tin nhắn từ khách hàng đến admin
//         io.emit('admin receive', data);
//     });


//     socket.on('admin send', (data) => {
//         console.log("data:", data)
//         const { customerSocketId, message } = data;
//         const customer = customers[customerSocketId];

//         if (customer) {
//         io.to(customerSocketId).emit('customer receive', `Admin (${socket.id}): ${message}`);
//         }
//     });


//     socket.on('disconnect', () => {
//         console.log('A user disconnected:', socket.id);

//         // Xóa khách hàng khỏi đối tượng customers khi họ ngắt kết nối
//         delete customers[socket.id];

//         // Gửi thông báo cho admin rằng một khách hàng đã ngắt kết nối
//         io.emit('admin message', `Admin: Customer (${socket.id}) disconnected.`);
//     });
// });

app.listen(PORT, () => {
    console.log(`Server start at port: ${PORT}`)
})
setInterval(() => {
    clearTokenList(TOKEN_BLACKLIST)
}, 3600000)
