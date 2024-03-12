import { mkdir } from "fs"
import { sendError, sendServerError } from "../helper/client.js"

export const createChucNangDir = (req, res, next) => {
    mkdir(`public/ChucNang`, { recursive: true }, (err) => {
        if (err) return sendError(res, 'Không thể tải tập tin lên.')
    })
    req.dirName = 'ChucNang'
    next()
}

export const createSinhVienDir = (req, res, next) => {
    mkdir(`public/SinhVien`, { recursive: true }, (err) => {
        if (err) return sendError(res, 'Không thể tải tập tin lên.')
    })
    req.dirName = 'SinhVien'
    next()
}

export const createGiangVienDir = (req, res, next) => {
    mkdir(`public/GiangVien`, { recursive: true }, (err) => {
        if (err) return sendError(res, 'Không thể tải tập tin lên.')
    })
    req.dirName = 'GiangVien'
    next()
}

export const createCanhBaoHocTapDir = (req, res, next) => {
    mkdir(`public/CanhBaoHocTap`, { recursive: true }, (err) => {
        if (err) return sendError(res, 'Không thể tải tập tin lên.')
    })
    req.dirName = 'CanhBaoHocTap'
    next()
}

export const createTotNghiepDir = (req, res, next) => {
    mkdir(`public/TotNghiep`, { recursive: true }, (err) => {
        if (err) return sendError(res, 'Không thể tải tập tin lên.')
    })
    req.dirName = 'TotNghiep'
    next()
}

export const createThucTapDir = (req, res, next) => {
    mkdir(`public/ThucTap`, { recursive: true }, (err) => {
        if (err) return sendError(res, 'Không thể tải tập tin lên.')
    })
    req.dirName = 'ThucTap'
    next()
}

export const createKhoaLuanDir = (req, res, next) => {
    mkdir(`public/KhoaLuan`, { recursive: true }, (err) => {
        if (err) return sendError(res, 'Không thể tải tập tin lên.')
    })
    req.dirName = 'KhoaLuan'
    next()
}