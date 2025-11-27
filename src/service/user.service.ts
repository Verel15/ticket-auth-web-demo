

import unauthen from '@/lib/axios/unauthenticate';
import authenticated from '@/lib/axios/authenticate';
import Cookies from 'js-cookie';

export async function login(username: string, password: string) {
    try {
        const instance = await unauthen()
        const response = await instance.post(`/api/v1/users/login`, { email: username, password })
        Cookies.set('token', response.data.data.token)
        Cookies.set('refreshToken', response.data.data.refreshToken)
        return response;

    } catch (error: any) {
        return error.response
    }
}

export async function profile() {
    try {
        const instance = await authenticated()
        const response = await instance.get(`/api/v1/users/profile`)
        return response.data;
    } catch (error: any) {
        return error.response || error.message
    }
}

export async function permissions() {
    try {
        const instance = await authenticated()
        const response = await instance.get(`/api/v1/permissions/user`)
        return response.data;
    } catch (error: any) {
        return error.response || error.message
    }
}

export async function company() {
    try {
        const instance = await authenticated()
        const response = await instance.get(`/api/v1/company`)
        return response.data;
    } catch (error: any) {
        return error.response || error.message
    }
}