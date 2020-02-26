export function setListProviders (state, payload) {
    state.listProviders.push(payload)

}

export function resetListProviders (state, payload) {
    state.listProviders = []

}

export function setErrors (state, payload) {
    state.errors.unshift(payload)

}

