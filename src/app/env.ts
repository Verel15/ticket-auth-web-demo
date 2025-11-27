'use server'

import { getPublicEnvByName, getEnvByName } from '@daniel-rose/envex/server'

export default async function getENV() {
    const userAPI = await getEnvByName('USER_API')
    const credentialAPI = await getEnvByName('CREDENTIAL_API')

    return { userAPI, credentialAPI }
}