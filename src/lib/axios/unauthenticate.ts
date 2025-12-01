import axios from 'axios';
import getENV from '../../app/env';

let cachedUnauthenInstance: any = null;
let envPromise: any = null;

async function loadEnvOnce() {
    // ... (ใช้โค้ด loadEnvOnce() เดิมที่กล่าวไว้ข้างต้น) ...
    // ... (เพื่อความกระชับ ขอละส่วนการตรวจสอบ cache/promise ไว้ที่นี่) ...
    if (!envPromise) {
        envPromise = getENV().then(env => env).catch(err => { envPromise = null; throw err; });
    }
    return envPromise;
}

export default async function getUnauthenInstance() {
    // 1. ตรวจสอบว่ามี instance ที่ถูก cache ไว้แล้วหรือไม่
    if (cachedUnauthenInstance) {
        return cachedUnauthenInstance;
    }

    // 2. เลือกค่าจาก NEXT_PUBLIC_* ถ้ามี (browser) เพื่อหลีกเลี่ยงการเรียก getENV() ที่เป็น server-only
    const clientUserAPI = typeof window !== 'undefined' ? process.env.NEXT_PUBLIC_USER_API : undefined;

    let userAPI: string | undefined;
    if (clientUserAPI) {
        userAPI = clientUserAPI;
    } else {
        // โหลด server env เฉพาะเมื่อไม่มี NEXT_PUBLIC_USER_API
        const env = await loadEnvOnce();
        userAPI = env.userAPI;
    }

    // 3. สร้าง Axios Instance
    const unauthen = axios.create()

    // 4. กำหนด Interceptor/baseURL
    unauthen.interceptors.request.use(async (config) => {
        // prefer NEXT_PUBLIC_USER_API on the browser
        config.baseURL = userAPI;
        if (typeof window !== 'undefined') console.debug('axios unauth baseURL ->', config.baseURL);
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