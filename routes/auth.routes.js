const { Router } = require('express')
const bcript = require('bcryptjs')
const jwt = require('jsonwebtoken')
const firebase = require('firebase')
const { check, validationResult } = require('express-validator')
const keys = require('../keys')

const Database = firebase.database()

const router = Router()

router.post(
    '/register',
    [
        check('name', 'Никнейм не должен быть пустым').isLength({ min: 1 }),
        check('email', 'Некорректный email').normalizeEmail().isEmail(),
        check('password', 'Минимальная длина пароля 6 символов').isLength({ min: 6 }),
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty())
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'Некорректные данные при регистрации',
                })

            const { name, email, password } = req.body
            const ref = Database.ref('/users')
            const candidate = await findUser(email)
            console.log(candidate)
            if (candidate)
                return res.status(400).json({ message: 'Такой пользователь уже существует' })
            const hasPass = await bcript.hash(password, 14)
            ref.push({ name, email, password: hasPass })
            res.status(201).json({ message: 'Пользователь успешно создан' })
        } catch (error) {
            console.log(error)
            res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
        }
    },
)

router.post(
    '/login',
    [
        check('email', 'Некорректный email').normalizeEmail().isEmail(),
        check('password', 'Минимальная длина пароля 6 символов').isLength({ min: 6 }),
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty())
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'Некорректные данные при входе в систему',
                })

            const { email, password } = req.body
            const user = await findUser(email)
            if (!user) return res.status(400).json({ message: 'Пользователь не найден' })
            const isMatch = await bcript.compare(password, user.child('password').val())
            if (!isMatch)
                return res.status(400).json({ message: 'Некорректные данные при входе в систему' })

            const token = jwt.sign({ userId: user.key, email }, keys.SESSION_SECRET, {
                expiresIn: '1h',
            })
            res.json({ token, userId: user.key })
        } catch (error) {
            console.log(error)
            res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
        }
    },
)

async function findUser(email) {
    let user = null
    const ref = Database.ref('/users')
    const users = await ref.once('value')
    users.forEach(childSnapshot => {
        const childEmail = childSnapshot.child('email').val()
        if (email === childEmail) {
            user = childSnapshot
        }
    })
    return user
}

module.exports = router
