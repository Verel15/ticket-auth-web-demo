'use client';

import Cookies from 'js-cookie';
import { useEffect } from 'react';
import { profile } from '@/service/user.service';
import { useAppDispatch } from '@/lib/store';
import { setUser } from '@/lib/store/authSlice';

export default function TokenProvider({ children }: { children: React.ReactNode }) {
    const dispatch = useAppDispatch();
    const token = Cookies.get('token');
    
    useEffect(() => {
        const getProfile = async () => {
            const user = await profile();
            dispatch(setUser({
                uuid: user.data.uuid,
                displayName: user.data.displayName,
                pictureUrl: user.data.pictureUrl,
                company: user.data.company,
                email: user.data.email,
            }))
        }

        if (token) {
            getProfile();
        }
    }, [token, dispatch])

    return <>{children}</>;
}