import jwt from "jsonwebtoken"
import { sendError, sendServerError, sendSuccess } from "../helper/client.js"

/**
 * header contain
 * Authorised : token
 */
export const verifyToken = async (req, res, next) => {
    try {
        const token = req.headers['x-access-token']
        // decode token
        if (token) {
            // verifies secret and checks exp
            jwt.verify(token, "publicKey", async function (err, decoded) {
                if (err) {
                    return sendSuccess(res, 'Vui lòng đăng nhập lại.', {
                        TrangThai: "Hết thời gian",
                        ThongBao: "Bạn vui lòng đăng nhập lại."
                    })
                } else {
                    req.decoded = decoded;
                    next();
                }
            });
        } else {
            return sendError(res, 'Bạn vui lòng đăng nhập.', 401)
        }
    } catch (error) {
        console.log(error);
        return sendError(res, 'Bạn không được phép thực hiện chức năng này.', 401)
    }
}

export const verifyAdmin = async (req, res, next) => {
    const role = req.decoded.QuyenTK;
    if (role != null && role != undefined){
        if (role == 'SINHVIEN' || role == 'GIANGVIEN') {
            return sendError(res, 'Bạn không được phép thực hiện chức năng này.', 403)
        }  
    } 
    else {
        return sendError(res, 'Bạn không được phép thực hiện chức năng này.', 403)
    }
    
    next()
}

export const verifyUser = async (req, res, next) => {
    const role = req.decoded.QuyenTK;
    if (role != null && role != undefined){
        if (role != 'SINHVIEN' && role != 'GIANGVIEN') {
            return sendError(res, 'Bạn không được phép thực hiện chức năng này.', 403)
        }  
    } 
    else {
        return sendError(res, 'Bạn không được phép thực hiện chức năng này.', 403)
    }
    
    next()
}