const ApiConstants = {
    baseUrl: process.env.REACT_APP_API_URL || 'http://localhost:8000/',
    analysisUrls: {
        audio: 'analyses/audio',
        getPreviousAnalyses: 'analyses/latest',
        text: 'analyses/text',
        video: 'analyses/video',
        youtube: 'analyses/url',
    },
    userUrls: {
        root: 'users',
        login: 'users/login/',
    }
}


export default ApiConstants;
