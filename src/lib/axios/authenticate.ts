import axios from 'axios';
import getENV from '@/app/env';
import Cookies from 'js-cookie';

const TOKEN_COOKIE_KEY = 'token';
const REFRESH_COKIE_KEY = 'refreshToken'
const REFRESH_TOKEN_PATH = '/api/v1/user/refresh'

let cachedEnv: any = null;
let envPromise: any = null;

/**
 * ฟังก์ชันสำหรับโหลด ENV เพียงครั้งเดียว
 * @returns {Promise<{userAPI: string, credentialAPI: string}>}
 */
async function loadEnvOnce() {
    if (cachedEnv) {
        return cachedEnv;
    }
    if (envPromise) {
        return envPromise;
    }

    envPromise = getENV().then(env => {
        cachedEnv = env;
        envPromise = null;
        return env;
    }).catch(error => {
        envPromise = null;
        throw error;
    });

    return envPromise;
}
// ------------------------------------

let cachedApiInstance: any = null;

export default async function authenticated() {
    if (cachedApiInstance) {
        return cachedApiInstance;
    }

    // Prefer client-side NEXT_PUBLIC_* variables when present so we don't have to
    // call server-only getENV() from the browser. Otherwise load server env.
    const clientUserAPI = typeof window !== 'undefined' ? process.env.NEXT_PUBLIC_USER_API : undefined;
    const clientCredentialAPI = typeof window !== 'undefined' ? process.env.NEXT_PUBLIC_CREDENTIAL_API : undefined;

    let userAPI: string | undefined;
    let credentialAPI: string | undefined;

    if (clientUserAPI || clientCredentialAPI) {
        userAPI = clientUserAPI;
        credentialAPI = clientCredentialAPI;
    } else {
        const env = await loadEnvOnce();
        userAPI = env.userAPI;
        credentialAPI = env.credentialAPI;
    }

    const baseURL = userAPI;

    const api = axios.create()

    api.interceptors.request.use(async (config) => {
        config.baseURL = baseURL; 
        // helpful debug when things go wrong — remove once confirmed working
        if (typeof window !== 'undefined') console.debug('axios auth baseURL ->', config.baseURL);
        
        const token = Cookies.get(TOKEN_COOKIE_KEY);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config
    }, (error) => {
        return Promise.reject(error)
    })

    async function refreshToken() {
        try {
            const token = Cookies.get(TOKEN_COOKIE_KEY);
            const refreshTokenResponse = await axios.patch(`${credentialAPI}/api/v1/credential/refresh`, {
                refreshToken: Cookies.get(REFRESH_COKIE_KEY)
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            return refreshTokenResponse.data;
        } catch (error) {
            Cookies.remove(TOKEN_COOKIE_KEY);
            Cookies.remove(REFRESH_COKIE_KEY);
            if (typeof window !== 'undefined') {
                 window.location.href = '/'
            }
            throw error;
        }
    }

    api.interceptors.response.use((response) => {
        return response
    }, async (error) => {

        const originalRequest = error.config;
        
        if (error.response?.status === 401 && originalRequest.url !== REFRESH_TOKEN_PATH) {
            
            const newAccessTokenData = await refreshToken();
            
            if (newAccessTokenData?.data?.token) {
                const newToken = newAccessTokenData.data.token;
                
                Cookies.set(TOKEN_COOKIE_KEY, newToken);
                Cookies.set(REFRESH_COKIE_KEY, newAccessTokenData.data.refreshToken);
                
                originalRequest.headers['Authorization'] = 'Bearer ' + newToken;
                
                return api(originalRequest)
            }
        }

        return Promise.reject(error)
    })

    cachedApiInstance = api;

    return api
}