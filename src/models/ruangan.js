const mongoose = require('mongoose')

const Ruangan = mongoose.model(
  'Ruangan',
  new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    picture: { type: String, default: '/image/default.png' },
  })
)

module.exports = Ruangan
