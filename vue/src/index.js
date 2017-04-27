import axios from 'axios'
import { app } from './app'
import './shared/icons.font'

// // Enable progressive web app support (with offline-plugin)
// if (process.env.NODE_ENV === 'production') {
//   require('./pwa')
// }

axios.defaults.withCredentials = true
app.$mount('#app')
