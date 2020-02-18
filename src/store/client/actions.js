import Api from '../services/api'

export function listClients ({commit}) {
    return Api().get('/clients')
}

export function addClients ({commit},payload) {
    return Api().post('/clients', payload)
}

export function updateClients ({commit},payload) {
    return Api().put(`/clients/${payload.id}`, payload.data)
}
export function deleteClients ({commit},payload) {
    return Api().delete(`/clients/${payload}`)
}