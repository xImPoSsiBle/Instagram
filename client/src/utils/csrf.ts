let csrfToken = ''

export const setCsrfToken = (token: string) => {
    csrfToken = token
}

export const getCsrfToken = () => csrfToken