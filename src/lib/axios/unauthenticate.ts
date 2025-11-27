import axios from 'axios';
import getENV from '../../app/env';

let cachedUnauthenInstance: any = null;
let envPromise: any = null;

async function loadEnvOnce() {
    // ... (ใช้โค้ด loadEnvOnce() เดิมที่กล่าวไว้ข้างต้น) ...
    // ... (เพื่อความกระชับ ขอละส่วนการตรวจสอบ cache/promise ไว้ที่นี่) ...
    if (!envPromise) {
        envPromise = getENV().then(env => { /* ... cache logic ... */ return env; });
    }
    return envPromise;
}

export default async function getUnauthenInstance() {
    // 1. ตรวจสอบว่ามี instance ที่ถูก cache ไว้แล้วหรือไม่
    if (cachedUnauthenInstance) {
        return cachedUnauthenInstance;
    }

    // 2. โหลด ENV (ซึ่งตอนนี้ถูก Memoize ไว้แล้ว)
    const env = await loadEnvOnce();

    // 3. สร้าง Axios Instance
    const unauthen = axios.create()

    // 4. กำหนด Interceptor/baseURL
    unauthen.interceptors.request.use(async (config) => {
        // กำหนด baseURL ที่โหลดมา
        config.baseURL = env.userAPI; 
        return config
    }, (error) => {
        return Promise.reject(error)
    })

    unauthen.interceptors.response.use((response) => {
        return response
    }, (error) => {
        return Promise.reject(error)
    })

    // 5. เก็บ Instance ที่สร้างแล้วไว้ใน cache
    cachedUnauthenInstance = unauthen;
    
    // 6. ส่ง Instance กลับไป
    return cachedUnauthenInstance
}