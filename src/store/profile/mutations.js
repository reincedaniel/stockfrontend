export function setListProfile (state, payload) {
    state.listProfile.push(payload)

}

export function resetListProfile (state, payload) {
    state.listProfile = []

}

export function setErrors (state, payload) {
    state.errors.unshift(payload)

}

