const Barang = require('../models/barang')
const Ruangan = require('../models/ruangan')

module.exports.add = async (req, res) => {
  try {
    const { name } = req.body

    const ruangan = await Ruangan.findOne({ name })

    if (!req.file) {
      req.flash('notification', 'Format file yang di upload tidak sesuai.')
      console.log('incorrect file format.')
      return res.redirect('back')
    }

    if (ruangan) {
      console.error('room name existed!')
      req.flash('notification', 'Nama ruangan sudah terdaftar.')
      return res.redirect('back')
    }

    req.body.picture = `/upload/${req.file?.filename}`

    new Ruangan(req.body).save()

    req.flash('notification', 'Ruangan baru berhasil ditambahkan.')
    console.log('ruangan baru ditambahkan')
    return res.redirect('back')
  } catch (e) {
    console.error('adding ruangan error!', e)
    req.flash('notification', 'Gagal menambahkan ruangan, silahkan coba lagi.')
    return res.redirect('back')
  }
}

exports.edit = async (req, res) => {
  try {
    const { id, name } = req.body
    const ruangan = await Ruangan.findById(id)

    if (!ruangan) {
      console.error('edit not found!')
      req.flash('notification', 'Ruangan yang akan diubah tidak ditemukan.')
      return res.redirect('back')
    }

    await Barang.updateMany(
      { room: ruangan.name },
      {
        $set: {
          room: name,
        },
      }
    )

    let picture = `/upload/${req.file?.filename}`

    if (!req.file) {
      picture = barang.picture
    }

    await Ruangan.findByIdAndUpdate(id, {
      $set: {
        name,
        picture,
      },
    })

    console.log('Ruangan edited!')
    req.flash('notification', 'Ruangan berhasil diubah.')
    return res.redirect('back')
  } catch (e) {
    console.error('editing ruangan error!', e)
    req.flash('notification', 'Gagal mengubah ruangan, silahkan coba lagi.')
    return res.redirect('back')
  }
}

exports.delete = async (req, res) => {
  try {
    const { id } = req.body
    const ruangan = await Ruangan.findById(id)

    if (!ruangan) {
      console.error('delete ruangan not found!')
      req.flash('notification', 'Ruangan yang akan dihapus tidak ditemukan.')
      return res.redirect('back')
    }

    const barang = await Barang.findOne({ room: ruangan.name })

    if (barang) {
      console.error('ruangan used!')
      req.flash(
        'notification',
        'Gagal menghapus ruangan, ada barang yang terdaftar dengan ruangan yang akan dihapus.'
      )
      return res.redirect('back')
    }

    await Ruangan.findByIdAndDelete(id)

    console.log('Ruangan deleted!')
    // req.flash('notification', 'Satu ruangan berhasil dihapus.')
    return res.redirect('back')
  } catch (e) {
    console.error('deleting ruangan error!', e)
    req.flash('notification', 'Gagal menghapus ruangan, silahkan coba lagi.')
    return res.redirect('back')
  }
}

exports.search = async (req, res) => {
  try {
    const { query } = req.body

    return res.redirect(`/ruangan?query=${query}`)
  } catch (e) {
    req.flash,
      e(
        'notification',
        'Terjadi kesalahan saat melakukan pencarian, coba lagi.'
      )
    console.error('ruangan search error.', e)
    return res.redirect('/')
  }
}
