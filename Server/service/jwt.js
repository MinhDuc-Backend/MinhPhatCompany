import jwt from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config()

export const clearTokenList = (tokenlist) => {
    for (let key in tokenlist) {
        try {
            jwt.verify(tokenlist[key], process.env.JWT_SECRET_KEY, { complete: true })
        } catch (error) {
            delete tokenlist[key]
        }
    }
}