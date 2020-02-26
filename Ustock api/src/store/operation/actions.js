import Api from '../services/api'

export function listOperations ({commit}) {
    return Api().get('/operations')
}

export function addOperations ({commit},payload) {
    return Api().post('/operations', payload)
}

export function updateOperations ({commit},payload) {
    return Api().put(`/operations/${payload.id}`, payload.data)
}
export function deleteOperations ({commit},payload) {
    return Api().delete(`/operations/${payload}`)
}