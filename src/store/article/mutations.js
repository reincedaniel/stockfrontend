export function setListArticles (state, payload) {
    state.listArticles.push(payload)

}

export function resetListArticles (state, payload) {
    state.listArticles = []

}

export function setErrors (state, payload) {
    state.errors.unshift(payload)

}

