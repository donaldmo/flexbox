const express = require('express')
const mongoose = require('mongoose')
const morgan = require('morgan')
const createError = require('http-errors')
const session = require("express-session")
const MongoDBStore = require('connect-mongodb-session')(session)
const cookieParser = require('cookie-parser')
const cors = require('cors')
const path = require('path')

const multer = require('multer')

require('dotenv').config()

const { verifyAccessToken } = require('./helpers/jwt_helper')
const AuthRoute = require('./routes/auth.route')
const PrifileRoute = require('./routes/profile.route')
const WorkspaceRoute = require('./routes/workspace.route')

const app = express()
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())
// app.use(cookieParser())

// Serve the static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE')
  res.setHeader('Access-Control-Allow-Headers', '*')
  next()
})

// // Production
const url = `mongodb+srv://flexbox_user_01:zsC8gfzmQ2lVpWN4@cluster0.yjoup.gcp.mongodb.net/flexbox_classroom`

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
  res.send('Hello from Flex Box')
})

/* @route /profile
*/ 
app.use('/auth', AuthRoute)

/* @route protected /profile
*/ 
app.use('/profile', verifyAccessToken, PrifileRoute)

/* @route protected /workspace
*/ 
app.use('/workspace', WorkspaceRoute)
app.use('/workspaces', WorkspaceRoute)

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

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

mongoose.connect(url, connectionParams)
  .then(() => {
    console.log('MongoDB Connected...')

    app.listen(PORT, () => {
      console.log(`Express server is running on port: ${PORT}`)
    })
  })
  .catch((err) => {
    console.error(`Error connecting to the database. \n${err}`)
  })
