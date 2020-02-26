import Api from '../services/api'

export function listProducts ({commit}) {
    return Api().get('/products')
}

export function addProducts ({commit},payload) {
    return Api().post('/products', payload)
}

export function updateProducts ({commit},payload) {
    return Api().put(`/products/${payload.id}`, payload.data)
}
export function deleteProducts ({commit},payload) {
    return Api().delete(`/products/${payload}`)
}