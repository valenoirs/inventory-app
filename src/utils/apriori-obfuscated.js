const { getApriori } = require('./apriori/index')
const Ruangan = require('../models/ruangan')
const Barang = require('../models/barang')

const apriori = async (support = 40, confidence = 40) => {
  let dataset = []

  const ruangan = await Ruangan.find()

  for (let room of ruangan) {
    let roomItems = []

    const barang = await Barang.find({ room: room.name })

    barang.forEach((item) => {
      roomItems.push(item.category)
    })

    dataset.push(roomItems.join(', '))
  }

  // dataset = require('./dummyDataset-obfuscated')

  return getApriori(dataset, support, confidence)
}

module.exports = apriori