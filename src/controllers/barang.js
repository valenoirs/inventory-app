const Barang = require('../models/barang')
const filter = require('../utils/fileFilter')
const path = require('path')

module.exports.add = async (req, res) => {
  try {
    const { quantity } = req.body

    if (req.file) {
      const validFile = filter(path.extname(req.file.originalname))

      if (validFile) {
        req.flash('notification', 'Format file yang di upload tidak sesuai.')
        console.log('incorrect file format.')
        return res.redirect('back')
      }

      req.body.picture = `/upload/${req.file?.filename}`
    }

    // const barang = await Barang.findOne({ code })

    // if (barang) {
    //   console.error('barang existed!')
    //   req.flash('notification', 'Kode barang sudah terdaftar.')
    //   return res.redirect('back')
    // }

    if (quantity < 1) {
      console.error('qunatity below zero!')
      req.flash('notification', 'Jumlah tidak boleh kurang dari 1.')
      return res.redirect('back')
    }

    new Barang(req.body).save()

    req.flash('notification', 'Barang berhasil ditambahkan.')
    console.log('barang baru ditambahkan')
    return res.redirect('back')
  } catch (e) {
    console.error('adding barang error!', e)
    req.flash('notification', 'Gagal menambahkan barang, silahkan coba lagi.')
    return res.redirect('back')
  }
}

exports.edit = async (req, res) => {
  try {
    const { id, name, code, brand, category, room, quantity } = req.body

    const barang = await Barang.findById(id)

    if (!barang) {
      console.error('barang not found!')
      req.flash('notification', 'Barang yang akan diubah tidak ditemukan.')
      return res.redirect('back')
    }

    let picture = `/upload/${req.file?.filename}`

    if (!req.file) {
      picture = barang.picture
    }

    await Barang.findByIdAndUpdate(id, {
      $set: {
        name,
        code,
        brand,
        category,
        room,
        quantity,
        picture,
      },
    })

    console.log('Barang edited!')
    req.flash('notification', 'Barang berhasil diubah.')
    return res.redirect('back')
  } catch (e) {
    console.error('editing barang error!', e)
    req.flash('notification', 'Gagal mengubah barang, silahkan coba lagi.')
    return res.redirect('back')
  }
}

exports.delete = async (req, res) => {
  try {
    const { id } = req.body
    const barang = await Barang.findById(id)

    if (!barang) {
      console.error('barang not found!')
      req.flash('notification', 'Barang yang akan diubah tidak ditemukan.')
      return res.redirect('back')
    }

    await Barang.findByIdAndDelete(id)

    console.log('Barang deleted!')
    req.flash('notification', 'Barang berhasil dihapus.')
    return res.redirect('back')
  } catch (e) {
    console.error('deleting barang error!', e)
    req.flash('notification', 'Gagal menghapus barang, silahkan coba lagi.')
    return res.redirect('back')
  }
}

exports.search = async (req, res) => {
  try {
    const { field, query } = req.body

    if (field === 'name') {
      return res.redirect(`/barang?field=${field}&query=${query}`)
    }
    if (field === 'code') {
      return res.redirect(`/barang?field=${field}&query=${query}`)
    }
    if (field === 'brand') {
      return res.redirect(`/barang?field=${field}&query=${query}`)
    }
    if (field === 'category') {
      return res.redirect(`/barang?field=${field}&query=${query}`)
    }
    if (field === 'room') {
      return res.redirect(`/barang?field=${field}&query=${query}`)
    }
  } catch (e) {
    req.flash(
      'notification',
      'Terjadi kesalahan saat melakukan pencarian, coba lagi.'
    )
    console.error('barang search error.', e)
    return res.redirect('/')
  }
}
