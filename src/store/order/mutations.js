export function setListOrders (state, payload) {
    state.listOrders.push(payload)

}

export function resetListOrders (state, payload) {
    state.listOrders = []

}

export function setErrors (state, payload) {
    state.errors.unshift(payload)

}

