import Api from '../services/api'

export function listLocations ({commit}) {
    return Api().get('/locations')
}

export function addLocations ({commit},payload) {
    return Api().post('/locations', payload)
}

export function updateLocations({commit},payload) {
    return Api().put(`/locations/${payload.id}`, payload.data)
}
export function deleteLocations ({commit},payload) {
    return Api().delete(`/locations/${payload}`)
}