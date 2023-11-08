const router = require('express').Router()
const handler = require('../controllers/user')

router.post('/', handler.add)
router.put('/', handler.edit)
router.delete('/', handler.delete)

router.put('/self', handler.updateProfile)
router.patch('/self', handler.updatePassword)

router.post('/login', handler.login)
router.get('/logout', handler.logout)

router.post('/search', handler.search)

module.exports = router
