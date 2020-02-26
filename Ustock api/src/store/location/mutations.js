export function setListLocations (state, payload) {
    state.listLocations.push(payload)

}

export function resetListLocations (state, payload) {
    state.listLocations = []

}

export function setErrors (state, payload) {
    state.errors.unshift(payload)

}

