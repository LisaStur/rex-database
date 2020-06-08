import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'
import { Movie } from './models/Movie'


const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/rexMovies"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

// Defines the port the app will run on. Defaults to 8080, but can be 
// overridden when starting the server. For example:
//
//   PORT=9000 npm start
const port = process.env.PORT || 8080
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(bodyParser.json())


// Start defining your routes here
app.get('/movies', (req, res) => {
  Movie.find().then(movies => res.json(movies))
})

app.post('/movies', async (req, res) => {
  const movie = new Movie(req.body)
  await movie.save()
  res.json(movie)
})

app.get('/:title', (req, res)   => {
  Movie.findOne({title: req.params.title}).then(movie => {
    if(movie) {
      res.json(movie)
    } else {
      res.status(404).json({ error: 'Could not find a movie with that title' })
    }
  })
}) 

Movie.deleteMany().then(() => {
  new Movie({
    title: 'A Man Is Dead',
    originalTitle: 'Un Homme est Mort',
    director: 'Olivier Cossu',
    country: 'France',
    ProductionYear: 2018,
    duration: 66,
    language: 'French, English subtitles',
    synopsis: 'Brest, 1950. Post-war reconstruction efforts in France have led to poor working conditions. The workers are on strike calling in vain for higher wages. P’tit Zef, Édouard (Mazé), and Désiré take part in demonstrations organized by the CGT syndicate when the situation suddenly becomes violent. The police shoot into the crowd and a bullet hits Édouard. The labor union calls upon the filmmaker René Vautier to film the events. P’tit Zef and Désiré accompany Vautier through the devastated city. Having at his side a man whose only weapon is a camera, P’tit Zef is consumed with anger. He wants revenge for the death of his friend.'
  }).save()
  new Movie({
    title: 'Buñuel in the Labyrinth of the Turtles',
    originalTitle: 'Buñuel en el laberinto de las tortugas',
    director: 'Salvador Simó',
    country: 'Spain',
    ProductionYear: 2018,
    duration: 88,
    language: 'Spanish with English subtitles',
    synopsis: 'Natália, trapped in a tedious job, engages in a search for a stolen heart. In a world where hearts can be deposited in a bank, the protagonist faces a dilemma: give her heart or keep it to herself.'
  }).save()
  new Movie({
    title: 'Between the Shadows',
    originalTitle: '',
    director: 'Mónica Santos, Alice Guimarães',
    country: 'Portugal, Sapin',
    ProductionYear: 2018,
    duration: 14,
    language: '',
    synopsis: 'Natália, trapped in a tedious job, engages in a search for a stolen heart. In a world where hearts can be deposited in a bank, the protagonist faces a dilemma: give her heart or keep it to herself.'
  }).save()
  new Movie({
    title: 'Nine Lives',
    originalTitle: '',
    director: 'Vojtěch Papp',
    country: 'Czech Republic ',
    ProductionYear: 2019,
    duration: 8,
    language: '',
    synopsis: "I’m an old, grumpy cat. Everybody hates me and I hate everybody. I hate this day just like all other days. But I think this day will be the last one.Yes, today I will end it all.How hard can it be?"
  }).save()
})


// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
