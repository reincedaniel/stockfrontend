import Api from '../services/api'

export function listCategories ({commit}) {
    return Api().get('/categories')
}

export function addCategories ({commit},payload) {
    return Api().post('/categories', payload)
}

export function updateCategories ({commit},payload) {
    return Api().put(`/categories/${payload.id}`, payload.data)
}
export function deleteCategories ({commit},payload) {
    return Api().delete(`/categories/${payload}`)
}