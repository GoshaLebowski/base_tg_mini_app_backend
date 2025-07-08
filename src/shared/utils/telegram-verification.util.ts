import * as crypto from 'crypto'
import * as querystring from 'querystring'

export function checkTelegramInitData(data: string, botToken: string) {
    const isDev = process.env.NODE_ENV === 'dev'
    const parsedData = querystring.parse(data)
    const hash = parsedData.hash as string
    delete parsedData.hash

    const dataCheckString = Object.keys(parsedData)
        .sort()
        .map(key => `${key}=${parsedData[key]}`)
        .join('\n')

    const secretKey = crypto
        .createHmac('sha256', 'WebAppData')
        .update(botToken)
        .digest()

    const computedHash = crypto
        .createHmac('sha256', secretKey)
        .update(dataCheckString)
        .digest('hex')

    if (computedHash !== hash) {
        return { isValid: false, user: null }
    } else {
        if (!isDev) {
            const CURRENT_UNIX_TIME = Math.floor(Date.now() / 1000)
            const TIMEOUT_SECONDS = 3600
            if (
                CURRENT_UNIX_TIME - Number(parsedData.auth_date) >
                TIMEOUT_SECONDS
            ) {
                return { isValid: false, user: null }
            }
        }

        let user = null
        if (parsedData.user && typeof parsedData.user === 'string') {
            try {
                user = JSON.parse(parsedData.user)
                if (!isDev && user.photo_url) {
                    user.photo_url = user.photo_url.replace(/\\\//g, '/')
                }
            } catch (e) {
                console.error('Failed to parse user JSON:', e)
                return { isValid: false, user: null }
            }
        }

        return {
            isValid: true,
            user
        }
    }
}