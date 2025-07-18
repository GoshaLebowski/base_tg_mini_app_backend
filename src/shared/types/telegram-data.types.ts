interface User {
    id: number
    first_name: string
    last_name: string
    username: string
    language_code: string
    is_premium: boolean
    allows_write_to_pm: boolean
    photo_url: string
}

export interface TelegramData {
    isValid: boolean
    user: User | null
}
