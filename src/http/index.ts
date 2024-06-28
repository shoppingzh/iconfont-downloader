import axios from 'axios'

const instance = axios.create({
  baseURL: 'https://www.iconfont.cn/api',
  timeout: 60000,
})

instance.interceptors.response.use(
  response => {
    const { data } = response
    return data
  },
  error => Promise.reject(error)
)

export default instance
