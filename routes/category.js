const router = require('express').Router()
const handler = require('../controllers/category')

const upload = require('../utils/fileHandler')

router.post('/', upload.single('file'), handler.add)
router.delete('/', handler.delete)

module.exports = router
