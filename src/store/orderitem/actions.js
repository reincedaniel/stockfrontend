import Api from '../services/api'

export function listOrderItems ({commit}) {
    return Api().get('/orderitems')
}

export function addOrderItems ({commit},payload) {

    return Api().post('/orderitems/', payload)
}

export function updateOrderItems ({commit},payload) {
    return Api().put(`/orderitems/${payload.id}`, payload.data)
}
export function deleteOrderItems ({commit},payload) {
    return Api().delete(`/orderitems/${payload}`)
}