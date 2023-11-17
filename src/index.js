const express = require('express')
const mongoose = require('mongoose')
const expressLayouts = require('express-ejs-layouts')
const session = require('express-session')
const methodOverride = require('method-override')
const flash = require('connect-flash')
const path = require('path')

const createDefaultUser = require('./utils/createDefaultUser')

require('dotenv').config()

const app = express()
const port = process.env.PORT || 5001

// Middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
  })
)

app.use((req, res, next) => {
  if (req.session.user) {
    res.locals.user = req.session.user
  }

  // res.locals.user = {
  //   name: 'El Valenoirs',
  //   email: 'L@L',
  //   role: 'ADMIN',
  // }

  // req.session.user = {
  //   name: 'El Valenoirs',
  //   email: 'L@L',
  //   role: 'ADMIN',
  // }

  next()
})

app.use(flash())
app.use(express.static(path.join(__dirname + '/public')))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(methodOverride('_method'))

// Templating Engine
app.set('views', path.join(__dirname + '/views'))
app.set('view engine', 'ejs')
app.use(expressLayouts)

// HTTP Routes
app.use('/', require('./routes/view'))

app.use('/user', require('./routes/user'))
app.use('/ruangan', require('./routes/ruangan'))
app.use('/barang', require('./routes/barang'))
app.use('/category', require('./routes/category'))

// Ping Server!
app.get('/ping', (req, res, next) => {
  res.send('pong!')
})

app.use('/', (req, res) => {
  res.status(404).send('<h1>404 : Page not found.</h1>')
})

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(port, () => {
      createDefaultUser()
      console.log(`Server running at port ${port}`)
    })
  })
  .catch((error) => console.error('Something went wrong!'))
