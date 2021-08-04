const express = require('express')
const mongoose = require('mongoose')
const morgan = require('morgan')
const createError = require('http-errors')
const session = require("express-session")
const MongoDBStore = require('connect-mongodb-session')(session)
const cookieParser = require('cookie-parser')
const cors = require('cors')

const multer = require('multer')

require('dotenv').config()

const { verifyAccessToken } = require('./helpers/jwt_helper')
const AuthRoute = require('./routes/auth.route')
const PrifileRoute = require('./routes/profile.route')

const app = express()
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())
// app.use(cookieParser())

app.use(express.static('public'))
app.use('/uploads', express.static('public'))
app.use('/images', express.static('public'))

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE')
  res.setHeader('Access-Control-Allow-Headers', '*')
  next()
})

// // Production
// const url = `mongodb+srv://pandopot:MF2MolHMUfmcnflJ@cluster0.yjoup.gcp.mongodb.net/pandopot`

const mongoDBStore = new MongoDBStore({
  uri: process.env.MONGODB_URL,
  collection: 'session',
  ttl: parseInt(process.env.SESSION_LIFETIME) / 1000
})


app.use(session({
  name: process.env.SESSION_NAME,
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: mongoDBStore,

  cookie: {
    maxAge: parseInt(process.env.SESSION_LIFETIME),
    sameSite: false, // this may need to be false is you are accessing from another React app
    httpOnly: false, // this must be false if you want to access the cookie
    secure: process.env.NODE_ENV === "production"
  }
}))

app.get('/', async (req, res, next) => {
  console.log(req.payload)
  res.send('Hello from pandopot')
})

/* @route /profile
*/ 
app.use('/auth', AuthRoute)

/* @route protected /profile
*/ 
app.use('/profile', verifyAccessToken, PrifileRoute)

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/")
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname)
  },
})

const fileFilter = (req, files, cb) => {
  console.log('file:', files)
  if (files.mimetype === 'image/png' || 
    files.mimetype === 'image/jpg' || 
    files.mimetype === 'image/jpeg'
  ){
    cb(null, true)
  }
  else {
    cb(null, true)
  }
}

const uploadStorage = multer()

app.post("/upload/multiple", uploadStorage.array("images", 10), (req, res) => {
  console.log(req.files)
  return res.send("Multiple files")
})

app.use(async (req, res, next) => {
  // const error = new Error('Not found')
  // error.status = 404
  // next(error)

  const error = createError.NotFound('404 page not found zzz')
  next(error)
})

app.use((err, req, res, next) => {
  res.status(err.status || 500)

  res.send({
    error: {
      status: err.status || 500,
      message: err.message
    }
  })
})

const PORT = process.env.PORT || 4000

const connectionParams = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
}

mongoose.connect(process.env.MONGODB_URL, connectionParams)
  .then(() => {
    console.log('MongoDB Connected...')

    app.listen(PORT, () => {
      console.log(`Express server is running on port: ${PORT}`)
    })
  })
  .catch((err) => {
    console.error(`Error connecting to the database. \n${err}`)
  })
