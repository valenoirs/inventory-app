const router = require('express').Router()

const Barang = require('../models/barang')
const Category = require('../models/category')
const Ruangan = require('../models/ruangan')
const User = require('../models/user')
const apriori = require('../apriori-obfuscated')

router.get('/barang', async (req, res) => {
  if (!req.session.user) {
    req.flash('notification', 'Harap login untuk melanjutkan.')
    res.redirect('/')
  }

  const { field, query } = req.query

  let barangs = await Barang.find()

  if (!field) {
    return res.redirect('/')
  } else if (field === 'name') {
    barangs = await Barang.find({
      name: { $regex: query, $options: 'i' },
    }).sort({ name: 1 })
  } else if (field === 'code') {
    barangs = await Barang.find({
      code: { $regex: query, $options: 'i' },
    }).sort({ code: 1 })
  } else if (field === 'brand') {
    barangs = await Barang.find({
      brand: { $regex: query, $options: 'i' },
    }).sort({ brand: 1 })
  } else if (field === 'category') {
    barangs = await Barang.find({
      category: { $regex: query, $options: 'i' },
    }).sort({ category: 1 })
  } else if (field === 'room') {
    barangs = await Barang.find({
      room: { $regex: query, $options: 'i' },
    }).sort({ room: 1 })
  }

  const categories = await Category.find()
  const ruangans = await Ruangan.find()

  res.render('barang', {
    layout: 'layout/main',
    notification: req.flash('notification'),
    barangs,
    categories,
    ruangans,
    field,
    query,
  })
})

router.get('/ruangan', async (req, res) => {
  if (!req.session.user) {
    req.flash('notification', 'Harap login untuk melanjutkan.')
    res.redirect('/')
  }

  const { query } = req.query

  let ruangans = await Ruangan.find()

  if (query) {
    ruangans = await Ruangan.find({
      name: { $regex: query, $options: 'i' },
    }).sort({ name: 1 })
  }

  res.render('ruangan', {
    layout: 'layout/main',
    notification: req.flash('notification'),
    ruangans,
    query,
  })
})

router.get('/ruangan/detail', async (req, res) => {
  if (!req.session.user) {
    req.flash('notification', 'Harap login untuk melanjutkan.')
    res.redirect('/')
  }

  const { id } = req.query
  let ruangan, barangs

  try {
    ruangan = await Ruangan.findById(id)
    barangs = await Barang.find({ room: ruangan.name })
  } catch (error) {
    res.redirect('/ruangan')
  }

  res.render('ruanganDetail', {
    layout: 'layout/main',
    notification: req.flash('notification'),
    ruangan,
    barangs,
  })
})

router.get('/user', async (req, res) => {
  if (!req.session.user) {
    req.flash('notification', 'Harap login untuk melanjutkan.')
    res.redirect('/')
  }

  const { field, query } = req.query
  const { email } = req.session.user

  let users = await User.find({ email: { $ne: email } })

  if (!field) {
    return res.redirect('/')
  } else if (field === 'name') {
    users = await User.find({
      name: { $regex: query, $options: 'i' },
      email: { $ne: email },
    }).sort({ name: 1 })
  } else if (field === 'email') {
    users = await User.find({
      email: { $regex: query, $options: 'i', $ne: email },
    }).sort({ email: 1 })
  } else if (field === 'role') {
    users = await User.find({
      role: { $regex: query, $options: 'i' },
      email: { $ne: email },
    }).sort({ role: 1 })
  }

  res.render('user', {
    layout: 'layout/main',
    notification: req.flash('notification'),
    users,
    field,
    query,
  })
})

router.get('/profile', async (req, res) => {
  if (!req.session.user) {
    req.flash('notification', 'Harap login untuk melanjutkan.')
    res.redirect('/')
  }

  const { email } = req.session.user

  const user = await User.findOne({ email })

  res.render('profile', {
    layout: 'layout/main',
    notification: req.flash('notification'),
    user,
  })
})

router.get('/rekomendasi', async (req, res) => {
  if (!req.session.user) {
    req.flash('notification', 'Harap login untuk melanjutkan.')
    res.redirect('/')
  }

  const { support, confidence } = req.query

  const { itemSupport: supports, allRules: rules } = await apriori(
    support,
    confidence
  )

  const sortedSupports = supports.sort((a, b) => a.Support - b.Support)
  const sortedRules = rules.sort(
    (a, b) => b.Confidence - b.Support - (a.Confidence - a.Support)
  )

  const result = supports.filter((e) => e.Support === sortedSupports[0].Support)

  res.render('rekomendasi', {
    layout: 'layout/main',
    notification: req.flash('notification'),
    supports: sortedSupports,
    rules: sortedRules,
    result,
  })
})

router.get('/', async (req, res) => {
  const barang = await Barang.find().count()
  const ruangan = await Ruangan.find().count()

  res.render('index', {
    layout: 'layout/main',
    notification: req.flash('notification'),
    barang,
    ruangan,
  })
})

module.exports = router
