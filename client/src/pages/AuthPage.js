import { useState, useContext, useEffect } from 'react'
import { Loader } from '../components/Loader/Loader'
import { Toasts } from '../components/Toasts/Toasts'
import { AuthContext } from '../context/AuthContext'
import { useHttp } from '../hooks/HttpHook'
import { useMessage } from '../hooks/MessageHook'
import classes from '../styles/auth.module.scss'

export const AuthPage = () => {
    const auth = useContext(AuthContext)
    const { loading, error, request, clearError } = useHttp()
    const { setValueMessage, message } = useMessage()
    const [active, setActive] = useState(false)

    const [registerState, setRegister] = useState({
        name: '',
        email: '',
        password: '',
    })
    const [loginState, setLogin] = useState({
        email: '',
        password: '',
    })

    useEffect(() => {
        if (error) {
            setValueMessage(error, 'error')
            clearError()
        }
    }, [error, clearError, setValueMessage])

    const clickHandler = event => {
        setActive(prev => !prev)
    }
    const onRegisterHandler = event => {
        setRegister({ ...registerState, [event.target.name]: event.target.value })
    }
    const onLoginHandler = event => {
        setLogin({ ...loginState, [event.target.name]: event.target.value })
    }

    const onRegister = async event => {
        event.preventDefault()
        try {
            const data = await request('/api/auth/register', 'POST', { ...registerState })
            setValueMessage(data.message, 'success')
            setRegister({
                name: '',
                email: '',
                password: '',
            })
        } catch (error) {}
    }

    const onLogin = async event => {
        event.preventDefault()
        try {
            const data = await request('/api/auth/login', 'POST', { ...loginState })
            auth.login(data.token, data.userId)
        } catch (e) {}
    }

    return (
        <div className={classes.wrapper}>
            {message && <Toasts type={message.type} message={message.message} />}
            <div
                className={[classes.container, active ? classes.rightPanelActive : null].join(' ')}
            >
                {loading && (
                    <div className={classes.loader}>
                        <Loader size="md" />
                    </div>
                )}
                <div className={[classes.formContainer, classes.signUpContainer].join(' ')}>
                    <form className={classes.form}>
                        <h1 className={classes.h1}>Создать аккаунт</h1>
                        <input
                            value={registerState.name}
                            name="name"
                            onChange={onRegisterHandler}
                            className={classes.input}
                            required
                            type="text"
                            placeholder="Никнейм"
                        />
                        <input
                            value={registerState.email}
                            name="email"
                            onChange={onRegisterHandler}
                            className={classes.input}
                            required
                            type="email"
                            placeholder="Email"
                        />
                        <input
                            value={registerState.password}
                            name="password"
                            onChange={onRegisterHandler}
                            className={classes.input}
                            required
                            type="password"
                            placeholder="Пароль"
                        />
                        <button onClick={onRegister} className={classes.button}>
                            Зарегистрироваться
                        </button>
                    </form>
                </div>
                <div className={[classes.formContainer, classes.signInContainer].join(' ')}>
                    <form className={classes.form}>
                        <h1 className={classes.h1}>Войти</h1>
                        <input
                            value={loginState.email}
                            name="email"
                            onChange={onLoginHandler}
                            className={classes.input}
                            required
                            type="email"
                            placeholder="Email"
                        />
                        <input
                            value={loginState.password}
                            name="password"
                            onChange={onLoginHandler}
                            className={classes.input}
                            required
                            type="password"
                            placeholder="Пароль"
                        />
                        <button onClick={onLogin} className={classes.button}>
                            Войти
                        </button>
                    </form>
                </div>
                <div className={classes.overlayContainer}>
                    <div className={classes.overlay}>
                        <div className={[classes.overlayPanel, classes.overlayLeft].join(' ')}>
                            <h1 className={classes.h1}>Добро пожаловать!</h1>
                            <p className={classes.p}>
                                Чтобы оставаться на связи с нами, войдите, указав свою личную
                                информацию
                            </p>
                            <button
                                onClick={clickHandler}
                                className={[classes.button, classes.ghost].join(' ')}
                            >
                                Войти
                            </button>
                        </div>
                        <div className={[classes.overlayPanel, classes.overlayRight].join(' ')}>
                            <h1 className={classes.h1}>Привет друг!</h1>
                            <p className={classes.p}>
                                Введите свои личные данные и начните покупки с нами
                            </p>
                            <button
                                onClick={clickHandler}
                                className={[classes.button, classes.ghost].join(' ')}
                            >
                                Зарегистрироваться
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
