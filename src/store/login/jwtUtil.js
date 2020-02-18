
    import jwt from 'jsonwebtoken'
    const AUTH_TOKEN_KEY = 'Authorization'
    const JWT_SIGN_SECRET = '8ogu4o8g0gg8043gg8g8ulg4go834uug4o303407743g7344380g01'

    function parseAuthorization(authorization) {
        return (authorization != null) ? authorization.replace('Bearer ', '') : null
    }
    export function getUserId(authorization) {
        var userId = -1
        var token =  parseAuthorization(authorization)
        if (token != null) {
            try {
                var jwtToken = jwt.verify(token, JWT_SIGN_SECRET)
                if (jwtToken != null)
                    userId = jwtToken.userId
            } catch (err) {}
        }
        return userId
    }
    export function destroyToken(authorization) {
        var token = module.exports.parseAuthorization(authorization)
        return jwt.destroy(token)
    }
    export function addToken(token) {
        localStorage.setItem(AUTH_TOKEN_KEY, token.token)
        localStorage.setItem('username', token.username)
        localStorage.setItem('name', token.name)
        localStorage.setItem('level', token.level)
        localStorage.setItem('id', token.id)
    }
    export function clearToken() {
        localStorage.removeItem(AUTH_TOKEN_KEY)
        localStorage.removeItem('username')
        localStorage.removeItem('name')
        localStorage.removeItem('level')
        localStorage.removeItem('id')

    }
    export function getToken() {
        return localStorage.getItem('Authorization')

    }

    export function isValid () {
       const token = localStorage.getItem('Authorization')
        if(!token) return false

        const userId = getUserId(token)

        try {
        
            if (userId < 0)
                return false
            else
                return true
        } catch (err) {
            return false
        }
    }
    

export default {
    getUserId,
    destroyToken,
    addToken,
    clearToken,
    isValid,
    getToken
}