const router = require('express').Router()
const handler = require('../controllers/barang')

const upload = require('../utils/fileHandler')

router.post('/', upload.single('file'), handler.add)
router.put('/', upload.single('file'), handler.edit)
router.delete('/', handler.delete)
router.post('/search', handler.search)

module.exports = router
