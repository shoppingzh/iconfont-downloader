import axios from 'axios'
import https from 'https'

const instance = axios.create({
  baseURL: 'https://www.iconfont.cn/api',
  timeout: 60000,
  httpsAgent: new https.Agent({
    rejectUnauthorized: false
  })
})

instance.interceptors.response.use(
  response => {
    const { data } = response
    return data
  },
  error => Promise.reject(error)
)

export default instance
