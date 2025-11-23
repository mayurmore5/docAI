import axios from 'axios';
import { auth } from '../firebase';

const client = axios.create({
    baseURL: 'http://localhost:8000',
});

client.interceptors.request.use(async (config) => {
    const user = auth.currentUser;
    if (user) {
        const token = await user.getIdToken();
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default client;
