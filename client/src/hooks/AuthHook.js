import { useState, useCallback, useEffect } from 'react'

export const useAuth = () => {
    const [token, setToken] = useState(null)
    const [ready, setReady] = useState(false)
    const [userId, setUserId] = useState(null)

    const logout = useCallback(() => {
        setToken(null)
        setUserId(null)

        localStorage.removeItem('Token')
    }, [])

    const autoLogot = useCallback(() => {
        setTimeout(() => {
            console.log('timer')
            logout()
        }, 60 * 60 * 1000)
    }, [logout])

    const login = useCallback(
        (jwtToken, id = null) => {
            setToken(jwtToken)
            setUserId(id)
            autoLogot()
            localStorage.setItem('Token', jwtToken)
        },
        [autoLogot],
    )

    useEffect(() => {
        const data = localStorage.getItem('Token')
        if (data) {
            login(data)
        }
        setReady(true)
    }, [login])

    return { token, userId, login, logout, ready }
}
