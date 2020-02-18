import Api from '../services/api'

export function listOrders ({commit}) {
    return Api().get('/orders')
}

export function addOrders ({commit},payload) {

    return Api().post('/orders/', payload)
}

export function addOrdersOrders ({commit},payload) {
    return Api().post('/orders/', payload.Input)
}

export function updateOrders ({commit},payload) {
    return Api().put(`/orders/${payload.id}`, payload.data)
}
export function deleteOrders ({commit},payload) {
    return Api().delete(`/orders/${payload}`)
}