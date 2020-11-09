import axios from 'axios'
const request = axios.create()
request.interceptors.request.use(
    (value) => value,
    (error) => error
)
request.interceptors.response.use(
    (value) => {
        if (value.status != 200 || value.data.code !== '0000') {
            return Promise.reject(value?.data?.message || '未知错误')
        }
        return value
    },
    (error) => error
)
export default request