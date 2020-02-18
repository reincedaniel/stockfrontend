export function setListInputs (state, payload) {
    state.listInputs.push(payload)

}

export function resetListInputs (state, payload) {
    state.listInputs = []

}

export function setErrors (state, payload) {
    state.errors.unshift(payload)

}

