export function setListOperations (state, payload) {
    state.listOperations.push(payload)

}

export function resetListOperations (state, payload) {
    state.listOperations = []

}

export function setErrors (state, payload) {
    state.errors.unshift(payload)

}

