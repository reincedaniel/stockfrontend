export function setListOrderItems (state, payload) {
    state.listOrderItems.push(payload)

}

export function resetListOrderItems (state, payload) {
    state.listOrderItems = []

}

export function setErrors (state, payload) {
    state.errors.unshift(payload)

}

