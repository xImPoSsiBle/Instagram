export const isDefaultAvatar = (path: string) => {
    return path.includes('default-avatar')
}

export const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}