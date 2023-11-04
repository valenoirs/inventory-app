const mongoose = require('mongoose')

const Barang = mongoose.model(
  'Barang',
  new mongoose.Schema({
    name: { type: String, required: true },
    code: { type: String, required: true, unique: true },
    brand: { type: String, required: true },
    category: { type: String, required: true },
    // condition: { type: String, required: true },
    room: { type: String, required: true },
    quantity: { type: String, default: 0 },
    picture: { type: String, default: '/image/default.png' },
  })
)

module.exports = Barang
