import './config'

// before app bootstrap
import { app } from './app'

// // Enable progressive web app support (with offline-plugin)
// if (process.env.NODE_ENV === 'production') {
//   require('./pwa')
// }

app.$mount('#app');
