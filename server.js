import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import { Movie } from './models/Movie'
import rexData from './data/rex-movies.json'

dotenv.config()

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/rexMovies"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

const port = process.env.PORT || 8080
const app = express()


app.use(cors())
app.use(bodyParser.json())

if(process.env.RESET_DATABASE) {
  console.log('Resetting database')

  const seedDatabase = async () => {
    await Movie.deleteMany({})
    rexData.forEach(entry=> {
      new Movie(entry).save()
    })
  } 
  seedDatabase()
}

app.get('/',  (req, res) => {
  res.send('Rex Animation')
})

app.get('/movies', async (req, res) => {
  await Movie.find().then(movies => res.json(movies))
})

app.get('/movies/:title', async (req,res) => {
  await Movie.findOne({title: req.params.title}).then(movie => {
    if (movie) {
      res.json(movie)
    } else {
      res.status(404).json({error: 'Not found'})
    }
  })
})

app.get('/section/:section', async (req, res) => {
  await Movies.findByID({section: req.params.section})
  .then(movies => res.json(movies))

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})


/*
import cloudinaryFramework from 'cloudinary'
import multer from 'multer'
import cloudinaryStorage from 'multer-storage-cloudinary'

const cloudinary = cloudinaryFramework.v2
cloudinary.config({
  cloud_name: 'dflx7bg5x',
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

const storage = cloudinaryStorage({
  cloudinary,
  params: {
    folder: 'rexMovies',
    allowedFormats: ['jpg', 'png'],
    transformation: [{ width: 1024, height: 650, crop: 'limit' }],
  },
})
const parser = multer({ storage })
*/

/*
app.post('/movies', async (req, res) => {
  const movie = new Movie(req.body)
  await movie.save()
  res.json(movie)
})

app.post('/rexMovies', parser.single('image'), async (req, res) => {
  res.json({ imageUrl: req.file.path, imageId: req.file.filename })
})

const MovieImage = mongoose.model('MovieImage', {
  name: String,
  imageUrl: String,
  imageID: String,
})

app.post('/rexMovies', parser.single('image'), async (req, res) => {
  try {
    const movieImage = await new MovieImage({
      name: req.body.filename,
      imageUrl: req.file.path
    }).save()
    res.json(movieImage)
  } catch (err) {
    res.status(400).json({ errors: err.errors })
  }
})
*/
