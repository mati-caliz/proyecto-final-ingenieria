const ApiConstants = {
    baseUrl: process.env.NODE_ENV === 'production' ? 'TODO AWS url' : 'http://localhost:8000/',
    userUrls: {
        root: 'users',
        login: 'users/login',
    }
}


export default ApiConstants;
