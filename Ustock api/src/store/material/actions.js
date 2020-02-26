import Api from '../services/api'

export function listMaterials ({commit}) {
    return Api().get('/materials')
}

export function addMaterials ({commit},payload) {
    return Api().post('/materials', payload)
}

export function updateMaterials ({commit},payload) {
    return Api().put(`/materials/${payload.id}`, payload.data)
}
export function deleteMaterials ({commit},payload) {
    return Api().delete(`/materials/${payload}`)
}