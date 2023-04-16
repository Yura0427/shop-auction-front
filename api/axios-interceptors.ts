import axios from 'axios';

import { getToken } from '../services/local-storage-controller';
import apiUrl from 'api/config';

axios.defaults.baseURL = apiUrl;

const instance = axios.create({
  baseURL: `${apiUrl}`,
});

export const ssrInstance = axios.create({
  baseURL: `${apiUrl}`,
});

ssrInstance.interceptors.response.use(
  (res) => res,
  async (err) => {
    if (err.response.status === 404) {
      return false;
    }
  }
);

instance.interceptors.request.use(
  (config) => {
    if (process.browser) {
      const token = getToken();
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return error;
  }
);

export default instance;
