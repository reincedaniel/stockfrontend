export function setListMaterials (state, payload) {
    state.listMaterials.push(payload)

}

export function resetListMaterials (state, payload) {
    state.listMaterials = []

}

export function setErrors (state, payload) {
    state.errors.unshift(payload)

}

