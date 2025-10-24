const getApiUrl = () => {
    return process.env.REACT_APP_API_URL || 'http://localhost:3001';
};

export const config = {
    apiUrl: getApiUrl()
};