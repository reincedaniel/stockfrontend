export function setListCategories (state, payload) {
    state.listCategories.push(payload)

}

export function resetListCategories (state, payload) {
    state.listCategories = []

}

export function setErrors (state, payload) {
    state.errors.unshift(payload)

}

