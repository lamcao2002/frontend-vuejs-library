const axios = require('axios')

const { localStorage } = window;

// Set config defaults when creating the instance
const instance = axios.create({
    baseURL: 'http://localhost:3000'
});

// Alter defaults after instance has been created
instance.defaults.headers.common['auth-token'] = localStorage.getItem('token');

instance.interceptors.request.use((config) => {
    console.log('Redirect to', config.url);
    return config;
});

instance.interceptors.response.use((response) => {
    // switch(response.status) {
    //     case 401: return // redirect to login
    //     case 400: return // handle show toask alert message error
    // }
    return response;
});

module.exports = instance;
