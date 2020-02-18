import Api from '../services/api'

export function listInputs ({commit}) {
    return Api().get('/inputs')
}

export function addInputs ({commit},payload) {

    return Api().post('/orders/', payload)
}

export function addInputsArticles ({commit},payload) {
    return Api().post('/inputs/', payload.Input)
}

export function updateInputs ({commit},payload) {
    return Api().put(`/inputs/${payload.id}`, payload.data)
}
export function deleteInputs ({commit},payload) {
    return Api().delete(`/inputs/${payload}`)
}