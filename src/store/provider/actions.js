import Api from '../services/api'

export function listProviders ({commit}) {
    return Api().get('/providers')
}

export function addProviders ({commit},payload) {
    return Api().post('/providers', payload)
}

export function updateProviders ({commit},payload) {
    return Api().put(`/providers/${payload.id}`, payload.data)
}
export function deleteProviders ({commit},payload) {
    return Api().delete(`/providers/${payload}`)
}