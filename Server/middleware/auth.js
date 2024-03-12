import jwt from "jsonwebtoken"

export const createTokenPair = async (payload, publicKey, privateKey) => {
    try {
        const accessToken = await jwt.sign(payload, publicKey, {
            expiresIn: "14 hours"
        })
        const refreshToken = await jwt.sign(payload, privateKey, {
            expiresIn: "7 days"
        })
        return { accessToken, refreshToken }
    } catch (error) {
        console.log(error)
        return sendError(res, 'Internal server error')
    }
}

export const createNewTokenPair = async (payload, publicKey, privateKey, expiresIn) => {
    try {
        const accessToken = await jwt.sign(payload, publicKey, {
            // expiresIn: "60 seconds"
            expiresIn: "1 hours"
        })
        const refreshToken = await jwt.sign(payload, privateKey, {
            expiresIn: `${expiresIn} seconds`
        })
        return { accessToken, refreshToken }
    } catch (error) {
        console.log(error)
        return sendError(res, 'Internal server error')
    }
}