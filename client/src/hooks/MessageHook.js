import { useCallback, useState } from 'react'

export const useMessage = () => {
    const [message, setMessage] = useState(null)

    const setValueMessage = useCallback((text, type) => {
        setMessage({ message: text, type })
        setTimeout(() => {
            setMessage(null)
        }, 5500)
    }, [])

    return { setValueMessage, message }
}
