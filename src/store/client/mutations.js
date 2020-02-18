export function setListClients (state, payload) {
    state.listClients.push(payload)

}

export function resetListClients (state, payload) {
    state.listClients = []

}

export function setErrors (state, payload) {
    state.errors.unshift(payload)

}

