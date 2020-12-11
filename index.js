const express = require('express')
const path = require('path')
const firebase = require('firebase')
const helmet = require('helmet')
const compression = require('compression')
const cors = require('cors')

const app = express()

app.use(express.json({ extended: true }))

const firebaseApp = firebase.initializeApp({
    apiKey: 'AIzaSyBzQaSLhbG_OtorvxJ2GenEeyWmzkgiAEw',
    authDomain: 'book-list-dbf90.firebaseapp.com',
    projectId: 'book-list-dbf90',
    storageBucket: 'book-list-dbf90.appspot.com',
    messagingSenderId: '46973059541',
    appId: '1:46973059541:web:ba582bfa17829921d17d5c',
})
const corsOptions = {
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: true,
    credentials: true,
}

app.use(helmet())
app.use(compression())

app.use(cors({ ...corsOptions, optionsSuccessStatus: 200 }))

app.use('/api/auth', require('./routes/auth.routes'))
app.use('/api/book', require('./routes/book.routes'))

if (process.env.NODE_ENV === 'production') {
    app.use('/', express.static(path.join(__dirname, 'client', 'build')))
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    })
}

const PORT = process.env.port || 5000
app.listen(PORT, () => {
    console.log('server has been started')
})
