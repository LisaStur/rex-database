import mongoose from 'mongoose'

export const Movie = mongoose.model('Movie', {
  title: String,
  originalTitle: String,
  director: String,
  country: String,
  ProductionYear: Number,
  duration: Number,
  language: String,
  synopsis: String,
}
)