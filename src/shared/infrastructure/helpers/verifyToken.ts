const jwt = require ('jsonwebtoken')

 export const verifyToken = async (token:any) =>{
    try {
        return jwt.verify(token, process.env.SECRET_JWT_KEY)
    } catch (e) {
        return null
    }
}

