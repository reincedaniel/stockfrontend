import axios from 'axios'

export default() => {
    let token =localStorage.getItem('Authorization')
    return axios.create({
        baseURL: 'http://10.11.1.68:1998/api',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            'Access-Control-Allow-Methods': '*',
            'Authorization': `Bearer ${token}`
        }
    })
}
