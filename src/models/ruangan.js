const mongoose = require('mongoose')

const Ruangan = mongoose.model(
  'Ruangan',
  new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    picture: { type: String, required: true },
  })
)

module.exports = Ruangan
