import axios from 'axios'
const store = require('./store').default

axios.defaults.baseURL = 'http://localhost:3000/'
// axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token')

store.subscribe((mutation) => {
    if (mutation.type === 'SET_USER_INFO') {
        axios.defaults.headers.common['auth-token'] = mutation.payload.token;
    }
})

// Alter defaults after instance has been created
axios.defaults.headers.common['auth-token'] = store.getters.GET_TOKEN;