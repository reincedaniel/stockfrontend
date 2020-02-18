import Api from '../services/api'

export function listUsers ({commit}) {
    return Api().get('/users')
}

export function addUsers ({commit},payload) {
    return Api().post('/users', payload)
}

export function updateUsers ({commit},payload) {
    return Api().put(`/users/${payload.id}`, payload.data)
}

export function updateUserPassWord ({commit},payload) {
    return Api().put(`/users/${payload.id}`, payload.data)
}

export function updateUsersPassWords ({commit},payload) {
    return Api().put(`/users`, payload)
}

export function deleteUsers ({commit},payload) {
    return Api().delete(`/users/${payload}`)
}