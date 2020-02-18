export function setListProducts (state, payload) {
    state.listProducts.push(payload)

}

export function resetListProducts (state, payload) {
    state.listProducts = []

}

export function setErrors (state, payload) {
    state.errors.unshift(payload)

}

