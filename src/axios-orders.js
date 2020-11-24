import axios from 'axios'

const instance = axios.create({
  baseURL: 'https://burger-builder-fcc47.firebaseio.com/',
})

export default instance
