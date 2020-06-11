import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import cloudinaryFramework from 'cloudinary'
import multer from 'multer'
import cloudinaryStorage from 'multer-storage-cloudinary'
//import { Movie } from './models/Movie'

dotenv.config()

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/rexMovies"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise


const port = process.env.PORT || 8080
const app = express()


app.use(cors())
app.use(bodyParser.json())


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


app.get('/movies', (req, res) => {
  Movie.find().then(movies => res.json(movies))
})

app.get('/movies/:title', (req,res) => {
  Movie.findOne({title: req.params.title}).then(movie => {
    if (movie) {
      res.json(movie)
    } else {
      res.status(404).json({error: 'Not found'})
    }
  })

})


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


const Movie = mongoose.model('Movie', {
  title: String,
  imageUrl: String,
  imageID: String,
  originalTitle: String,
  director: String,
  country: String,
  productionYear: Number,
  duration: Number,
  language: String,
  synopsis: String,
}
)

Movie.deleteMany().then(() => {
  new Movie({
    title: 'A Man Is Dead',
    imageUrl: 'https://res.cloudinary.com/dflx7bg5x/image/upload/v1591636578/rexMovies/dl6tjcc9kd9puvmkbmpi.jpg',
    imageID: 'rexMovies/pykfwcmqkx2iljlpyphy',
    originalTitle: 'Un Homme est Mort',
    director: 'Olivier Cossu',
    country: 'France',
    productionYear: 2018,
    duration: 66,
    language: 'French, English subtitles',
    synopsis: 'Brest, 1950. Post-war reconstruction efforts in France have led to poor working conditions. The workers are on strike calling in vain for higher wages. P’tit Zef, Édouard (Mazé), and Désiré take part in demonstrations organized by the CGT syndicate when the situation suddenly becomes violent. The police shoot into the crowd and a bullet hits Édouard. The labor union calls upon the filmmaker René Vautier to film the events. P’tit Zef and Désiré accompany Vautier through the devastated city. Having at his side a man whose only weapon is a camera, P’tit Zef is consumed with anger. He wants revenge for the death of his friend.'
  }).save()
  new Movie({
    title: 'Buñuel in the Labyrinth of the Turtles',
    imageUrl: 'https://res.cloudinary.com/dflx7bg5x/image/upload/v1591700786/rexMovies/usamqt0ofqbjpokvw4qm.jpg',
    imageID: 'rexMovies/usamqt0ofqbjpokvw4qm',
    originalTitle: 'Buñuel en el laberinto de las tortugas',
    director: 'Salvador Simó',
    country: 'Spain',
    productionYear: 2018,
    duration: 88,
    language: 'Spanish with English subtitles',
    synopsis: 'Natália, trapped in a tedious job, engages in a search for a stolen heart. In a world where hearts can be deposited in a bank, the protagonist faces a dilemma: give her heart or keep it to herself.'
  }).save()
  new Movie({
    title: 'Between the Shadows',
    imageUrl: 'https://res.cloudinary.com/dflx7bg5x/image/upload/v1591700874/rexMovies/j4ed4w1uchvopy0cq4un.jpg',
    imageID: 'rexMovies/j4ed4w1uchvopy0cq4un',
    originalTitle: '',
    director: 'Mónica Santos, Alice Guimarães',
    country: 'Portugal, Spain',
    productionYear: 2018,
    duration: 14,
    language: '',
    synopsis: 'Natália, trapped in a tedious job, engages in a search for a stolen heart. In a world where hearts can be deposited in a bank, the protagonist faces a dilemma: give her heart or keep it to herself.'
  }).save()
  new Movie({
    title: 'Nine Lives',
    imageUrl: 'https://res.cloudinary.com/dflx7bg5x/image/upload/v1591695289/rexMovies/w23z4jpiwbirbgczbpap.png',
    imageID: 'rexMovies/w23z4jpiwbirbgczbpap',
    originalTitle: '',
    director: 'Vojtěch Papp',
    country: 'Czech Republic ',
    productionYear: 2019,
    duration: 8,
    language: '',
    synopsis: "I’m an old, grumpy cat. Everybody hates me and I hate everybody. I hate this day just like all other days. But I think this day will be the last one.Yes, today I will end it all.How hard can it be?"
  }).save()
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})

