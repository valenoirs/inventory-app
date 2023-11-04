const mongoose = require('mongoose')

const Category = mongoose.model(
  'Category',
  new mongoose.Schema({
    name: { type: String, required: true, unique: true },
  })
)

module.exports = Category
