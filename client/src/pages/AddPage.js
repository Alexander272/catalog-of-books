import { useState, useContext, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Input } from '../components/Input/Input'
import { Button } from '../components/Button/Button'
import { Toasts } from '../components/Toasts/Toasts'
import { Loader } from '../components/Loader/Loader'
import { useHttp } from '../hooks/HttpHook'
import { useMessage } from '../hooks/MessageHook'
import { AuthContext } from '../context/AuthContext'
import classes from '../styles/add.module.scss'

export const AddPage = () => {
    const [form, setForm] = useState({
        name: '',
        url: '',
        author: '',
        theYearOfPublishing: '',
        ISBN: '',
    })
    const auth = useContext(AuthContext)
    const { loading, error, request, clearError } = useHttp()
    const { setValueMessage, message } = useMessage()

    useEffect(() => {
        if (error) {
            setValueMessage(error, 'error')
            clearError()
        }
    }, [error, clearError, setValueMessage])

    const changeHandler = event => {
        setForm({
            ...form,
            [event.target.name]: event.target.value,
        })
    }

    const saveHandler = async event => {
        try {
            const data = await request(
                '/api/book/add',
                'POST',
                { ...form },
                { Authtorization: `Bearer ${auth.token}` },
            )
            setValueMessage(data.message, 'success')
            setForm({
                name: '',
                url: '',
                author: '',
                theYearOfPublishing: '',
                ISBN: '',
            })
        } catch (e) {}
    }

    return (
        <div className="container">
            <div className="content">
                <div className={classes.header}>
                    <h1 className={classes.title}>Добавить книгу</h1>
                    <Link className={classes.link} to="/">
                        Вернуться в каталог
                    </Link>
                </div>
                {message && <Toasts type={message.type} message={message.message} />}
                <div className={classes.form}>
                    {loading ? (
                        <div className={classes.loader}>
                            <Loader size={'md'} />
                        </div>
                    ) : (
                        <>
                            <Input
                                type="text"
                                name="name"
                                value={form.name}
                                placeholder="Название"
                                onChange={changeHandler}
                            />
                            <Input
                                type="text"
                                name="url"
                                value={form.url}
                                placeholder="Изображение книги (url-адрес)"
                                onChange={changeHandler}
                            />
                            <Input
                                type="text"
                                name="author"
                                value={form.author}
                                placeholder="Автор"
                                onChange={changeHandler}
                            />
                            <Input
                                type="text"
                                name="theYearOfPublishing"
                                value={form.theYearOfPublishing}
                                placeholder="Год издания"
                                onChange={changeHandler}
                            />
                            <Input
                                type="text"
                                name="ISBN"
                                value={form.ISBN}
                                placeholder="ISBN"
                                onChange={changeHandler}
                            />
                            <Button text="Сохранить" type="primary" onClick={saveHandler} />
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}
