import { useState, useEffect, useContext, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { Loader } from '../components/Loader/Loader'
import { useHttp } from '../hooks/HttpHook'
import { AuthContext } from '../context/AuthContext'
import classes from '../styles/home.module.scss'
import { Modal } from '../components/Modal/Modal'

export const HomePage = () => {
    const { token } = useContext(AuthContext)
    const [books, setBooks] = useState(null)
    const [currentBook, setCurrentBook] = useState(null)
    const { loading, request } = useHttp()
    const [isOpenModal, setIsOpenModal] = useState(false)

    const toggleHandler = () => {
        setIsOpenModal(prev => !prev)
    }

    const fetchBooks = useCallback(async () => {
        try {
            const fetched = await request('/api/book/all', 'GET', null, {
                Authtorization: `Bearer ${token}`,
            })
            setBooks(fetched)
        } catch (error) {}
    }, [token, request])

    useEffect(() => {
        fetchBooks()
    }, [fetchBooks])

    const confirmHandler = event => {
        setCurrentBook(event.target.dataset.id)
        toggleHandler()
    }

    const deleteBook = async id => {
        try {
            console.log(id)
            await request(`/api/book/remove/${id}`, 'DELETE', null, {
                Authtorization: `Bearer ${token}`,
            })
            toggleHandler()
            const newBooks = books
            delete newBooks[currentBook]
            setCurrentBook(null)
            setBooks(newBooks)
        } catch (error) {}
    }

    const renderBooks = () => {
        let renderedBook = []
        for (const book in books) {
            renderedBook.push(
                <div key={book} className={classes.book}>
                    <div className={classes.btns}>
                        <Link
                            to={`/edit/${book}`}
                            className={[classes.btn, classes.editBtn].join(' ')}
                        >
                            &#9998;
                        </Link>
                        <p
                            onClick={confirmHandler}
                            className={[classes.btn, classes.delBtn].join(' ')}
                            data-id={book}
                        >
                            &#10060;
                        </p>
                    </div>
                    <div className={classes.containerBlock}>
                        <div className={classes.imageContainer}>
                            <img
                                className={classes.image}
                                src={books[book].url}
                                alt={books[book].name}
                            />
                        </div>
                        <div className={classes.info}>
                            <p className={classes.bookName}>{books[book].name}</p>
                            <p className={classes.author}>{books[book].author}</p>
                            <p className={classes.extraInfo}>
                                Год издания: {books[book].theYearOfPublishing}
                            </p>
                            <p className={classes.extraInfo}>ISBN: {books[book].ISBN}</p>
                        </div>
                    </div>
                </div>,
            )
        }
        return renderedBook
    }

    return (
        <div className="container">
            <Modal
                title="Удалить книгу?"
                isOpen={isOpenModal}
                onToggle={toggleHandler}
                onClickBtn={deleteBook.bind(null, currentBook)}
            >
                {currentBook && (
                    <>
                        <p className={classes.modalInfo}>Книга: {books[currentBook].name}</p>
                        <p className={classes.modalInfo}>Автор: {books[currentBook].author}</p>
                    </>
                )}
            </Modal>
            <div className="content">
                {loading ? (
                    <Loader size="md" />
                ) : (
                    <>
                        <div className={classes.header}>
                            <h1 className={classes.title}>Каталог книг </h1>
                            <Link className={classes.link} to="/add">
                                Добавить книгу
                            </Link>
                        </div>
                        <div className={classes.books}>
                            {books ? renderBooks() : <p>Книг пока нет</p>}
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}
