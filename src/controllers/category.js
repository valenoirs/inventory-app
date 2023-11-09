const Category = require('../models/category')
const Barang = require('../models/barang')

module.exports.add = async (req, res) => {
  try {
    const { name } = req.body

    const category = await Category.findOne({ name })

    if (category) {
      console.error('adding category error!')
      req.flash('notification', 'Kategori sudah terdaftar.')
      return res.redirect('back')
    }

    new Category(req.body).save()

    console.log('category baru ditambahkan')
    req.flash('notification', 'Kategori berhasil ditambahkan.')
    return res.redirect('barang')
  } catch (e) {
    console.error('adding category error!', e)
    req.flash('notification', 'Gagal menambahkan kategori, silahkan coba lagi.')
    return res.redirect('back')
  }
}

exports.delete = async (req, res) => {
  try {
    const { id } = req.body
    const category = await Category.findById(id)

    if (!category) {
      console.error('category not found!')
      req.flash('notification', 'Kategori tidak ditemukan.')
      return res.redirect('back')
    }

    const barang = await Barang.findOne({ category: category.name })

    if (barang) {
      console.error('category used!')
      req.flash(
        'notification',
        'Gagal menghapus kategori, ada barang yang terdaftar dengan kategori yang akan dihapus.'
      )
      return res.redirect('back')
    }

    await Category.findByIdAndDelete(id)

    req.flash('notification', 'Kategori berhasil dihapus.')
    console.log('Category deleted!')
    return res.redirect('back')
  } catch (e) {
    console.error('deleting category error!', e)
    req.flash('notification', 'Gagal menghapus kategori, silahkan coba lagi.')
    return res.redirect('back')
  }
}
