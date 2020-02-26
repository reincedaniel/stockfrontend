import Api from '../services/api'

export function listProfile ({commit}, payload) {
    return Api().get(`/users/profile/${payload}`)
}


export function updateProfile ({commit},payload) {
    return Api().put(`/users/${payload.id}`, payload.data)
}

export function updateProfilePassWord ({commit},payload) {
    return Api().put(`/users/profile/${payload.id}`, payload.data)
}
