import mongoose from 'mongoose'

export const Movie = mongoose.model('Movie', {
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
  section: String,
}
)