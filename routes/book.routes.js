const { Router } = require('express')
const { check, validationResult } = require('express-validator')
const firebase = require('firebase')
const auth = require('../middleware/auth.middleware')

const router = Router()

const Database = firebase.database()

router.get('/all', auth, async (req, res) => {
    try {
        const ref = Database.ref('/books')
        const books = await ref.get()
        res.json(books)
    } catch (error) {
        console.log(error)
        res.status(500).json(error.message)
    }
})

router.get('/:id', auth, async (req, res) => {
    try {
        const ref = Database.ref(`/books/${req.params.id}`)
        const book = await ref.get()
        res.json(book)
    } catch (error) {
        console.log(error)
        res.status(500).json(error.message)
    }
})

router.post(
    '/add',
    auth,
    [
        check('name', 'Назвние не должно быть пустым').isLength({ min: 1 }),
        check('author', 'Автор должен быть указан').isLength({ min: 2 }),
        check('theYearOfPublishing', 'В поле год необходимо указать 4 цифры').isLength({
            min: 4,
            max: 4,
        }),
        check('ISBN', 'ISBN не корректен').isLength({ min: 17, max: 17 }),
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty())
                return res.status(400).json({
                    errors: errors.array(),
                    message: errors.errors[0].msg,
                })
            if (req.body.ISBN.split('-').length !== 5) {
                return res.status(400).json({ message: 'ISBN не корректен' })
            }
            const ref = Database.ref('/books')
            ref.push({ ...req.body })
            res.status(201).json({ message: 'Книга успешно добавлена' })
        } catch (error) {
            console.log(error)
            res.status(500).json(error.message)
        }
    },
)

router.patch(
    '/update/:id',
    auth,
    [
        check('name', 'Назвние не должно быть пустым').isLength({ min: 1 }),
        check('author', 'Автор должен быть указан').isLength({ min: 2 }),
        check('theYearOfPublishing', 'В поле год необходимо указать 4 цифры').isLength({
            min: 4,
            max: 4,
        }),
        check('ISBN', 'ISBN не корректен').isLength({ min: 17, max: 17 }),
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty())
                return res.status(400).json({
                    errors: errors.array(),
                    message: errors.errors[0].msg,
                })
            if (req.body.ISBN.split('-').length !== 5) {
                return res.status(400).json({ message: 'ISBN не корректен' })
            }
            const ref = Database.ref(`/books/${req.params.id}`)
            ref.set({ ...req.body })
            res.json({ message: 'Книга успешно обновлена' })
        } catch (error) {
            console.log(error)
            res.status(500).json(error.message)
        }
    },
)

router.delete('/remove/:id', auth, async (req, res) => {
    try {
        const ref = Database.ref(`/books/${req.params.id}`)
        const book = await ref.remove()
        res.json({ message: 'Удаление прошло успешно' })
    } catch (error) {
        console.log(error)
        res.status(500).json(error.message)
    }
})

module.exports = router
