const User = require('../models/user')

const createDefaultUser = async () => {
  const user = await User.find({ role: 'ADMIN' })

  if (!user.length) {
    new User({
      name: 'Admin',
      email: 'admin@minahasa.go.id',
      password: 'admin001',
      role: 'ADMIN',
    }).save()

    console.log('No user with admin role found, default user added')
    return
  }

  console.log('User with admin role found')
  return
}

module.exports = createDefaultUser
