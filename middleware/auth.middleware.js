const jwt = require('jsonwebtoken')
const keys = require('../keys')

module.exports = (req, res, next) => {
    if (req.method === 'OPTIONS') {
        return next()
    }

    try {
        const token = req.headers.authtorization.split(' ')[1]
        if (!token) return res.status(401).json({ message: 'Нет авторизации' })
        const decoded = jwt.verify(token, keys.SESSION_SECRET)
        req.user = decoded
        next()
    } catch (error) {
        console.log(error)
        return res.status(401).json({ message: 'Нет авторизации' })
    }
}
