const { getApriori } = require('../apriori/index')
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

  // dummy dataset
  // dataset = [
  //   'Meja, Kursi, Lemari, Dispenser, Monitor, Mouse, Keyboad, Komputer',
  //   'Kursi, Cangkir, Komputer, Mouse, Botol, Dispenser',
  //   'Komputer, Cangkir, Kursi, Monitor, Mouse, Botol, Meja',
  //   'Lemari, Monitor, Kursi',
  //   'Cangkir, Monitor, Komputer, Kursi',
  //   'Lemari, Kursi, Monitor, Dispenser, Botol, Mouse',
  //   'Lemari, Meja, Cangkir, Komputer, Monitor',
  //   'Mouse, Cangkir',
  //   'Kursi, Cangkir, Lemari, Dispenser',
  //   'Cangkir, Komputer',
  // ]

  return getApriori(dataset, support, confidence)
}

module.exports = apriori
