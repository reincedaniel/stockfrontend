import Api from '../services/api'

export function listArticles ({commit}) {
    return Api().get('/articles')
}

export function addArticles ({commit},payload) {
    return Api().post('/articles', payload)
}

export function updateArticles ({commit},payload) {
    return Api().put(`/articles/${payload.idArticle}`, payload)
}
export function deleteArticles ({commit},payload) {
    //Api().delete(`/inputs/${payload.idInput}`)
    return Api().delete(`/articles/${payload.idArticle}`)
}