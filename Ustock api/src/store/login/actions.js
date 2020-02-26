import Api from '../services/api'
import jwtUtil from './jwtUtil'

export function login ({commit},payload) {
    return Api().post('/login', payload)
}

export function listUsers ({commit}) {
    return Api().get('/users')
}

export function addToken ({commit},payload) {
    
    return jwtUtil.addToken (payload)
}
export function clearToken ({commit}) {
    
    return jwtUtil.clearToken()
}
export function isValidToken ({commit}) {
    return jwtUtil.isValid()
}
export function getToken ({commit}) {
    return jwtUtil.getToken()
}

export function getLevel ({commit}) {
    return localStorage.getItem('level')
}