import { mkdir } from "fs"
import { sendError, sendServerError } from "../helper/client.js"

export const createChucNangDir = (req, res, next) => {
    mkdir(`public/ChucNang`, { recursive: true }, (err) => {
        if (err) return sendError(res, 'Không thể tải tập tin lên.')
    })
    req.dirName = 'ChucNang'
    next()
}

export const createSanPhamDir = (req, res, next) => {
    mkdir(`public/SanPham`, { recursive: true }, (err) => {
        if (err) return sendError(res, 'Không thể tải tập tin lên.')
    })
    req.dirName = 'SanPham'
    next()
}

export const createThongTinCtyDir = (req, res, next) => {
    mkdir(`public/ThongTinCty`, { recursive: true }, (err) => {
        if (err) return sendError(res, 'Không thể tải tập tin lên.')
    })
    req.dirName = 'ThongTinCty'
    next()
}
