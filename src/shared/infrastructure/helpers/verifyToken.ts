const jwt = require ('jsonwebtoken')

export const verifyToken = async (token: any) => {
    try {
        return jwt.verify(token, process.env.SECRET_JWT_KEY);
    } catch (e: any) {
        if (e.name === 'TokenExpiredError') {
            return {
                error: 'Token expirado',
                expiredAt: e.expiredAt,
            };
        }
        return {
            error: 'Token inválido o no autorizado',
            details: e.message,
        };
    }
};
