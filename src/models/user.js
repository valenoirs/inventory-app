const mongoose = require('mongoose')

const User = mongoose.model(
  'User',
  new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, default: 'USER' },
    password: { type: String, required: true },
  })
)

module.exports = User
