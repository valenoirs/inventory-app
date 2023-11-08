const comparePassword = require('../utils/comparePassword')
const User = require('../models/user')

module.exports.add = async (req, res) => {
  try {
    const { email } = req.body

    const user = await User.findOne({ email })

    if (user) {
      console.error('user existed!')
      req.flash('notification', 'User sudah terdaftar.')
      return res.redirect('back')
    }

    new User(req.body).save()

    console.log('user baru ditambahkan')
    return res.redirect('back')
  } catch (e) {
    console.error('adding user error!', e)
    req.flash('notification', 'Gagal menambahkan user, silahkan coba lagi.')
    return res.redirect('back')
  }
}

exports.edit = async (req, res) => {
  try {
    const { id, name, email, password, role } = req.body

    const user = await User.findById(id)

    if (!user) {
      console.error('user not found!')
      req.flash('notification', 'User yang akan diubah tidak ditemukan.')
      return res.redirect('back')
    }

    await User.findByIdAndUpdate(id, {
      $set: {
        name,
        email,
        password,
        role,
      },
    })

    console.log('User edited!')
    req.flash('notification', 'User berhasil diubah.')
    return res.redirect('back')
  } catch (e) {
    console.error('editing user error!', e)
    req.flash('notification', 'Gagal mengubah user, silahkan coba lagi.')
    return res.redirect('back')
  }
}

exports.delete = async (req, res) => {
  try {
    const { id } = req.body

    const user = await User.findById(id)

    if (!user) {
      console.error('user not found!')
      req.flash('notification', 'User yang akan dihapus tidak ditemukan.')
      return res.redirect('back')
    }

    await User.findByIdAndDelete(id)

    console.log('User deleted!')
    req.flash('notification', 'User berhasil dihapus.')
    return res.redirect('back')
  } catch (e) {
    console.error('deleting user error!', e)
    req.flash('notification', 'Gagal menghapus user, silahkan coba lagi.')
    return res.redirect('back')
  }
}

module.exports.logout = (req, res) => {
  try {
    delete req.session.user

    req.flash('notification', 'Logout berhasil.')
    console.log('User logged out!')
    return res.redirect('/')
  } catch (e) {
    console.error('logout-error', e)
    req.flash('notification', 'Terjadi kesalahan pada server, coba lagi.')
    return res.redirect('/logout')
  }
}

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email })

    if (!user) {
      console.log('User not found!')
      req.flash('notification', 'Email atau password salah.')
      return res.redirect('/')
    }

    const authenticated = comparePassword(password, user.password)

    if (!authenticated) {
      console.log('Password invalid!')
      req.flash('notification', 'Email atau password salah.')
      return res.redirect('/')
    }

    const { id, name, role } = user

    const session = { id, name, email, role }

    req.session.user = session

    console.log('a user logged in.')
    return res.redirect('/')
  } catch (e) {
    console.error('login-error', e)
    req.flash('notification', 'Terjadi kesalahan pada server, coba lagi.')
    return res.redirect('/')
  }
}

exports.updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body
    const { id } = req.session.user

    const user = await User.findById(id)

    if (!user) {
      console.error('user not found!')
      req.flash('notification', 'User yang akan diubah tidak ditemukan.')
      return res.redirect('/profile')
    }

    await User.findByIdAndUpdate(id, {
      $set: {
        name,
      },
    })

    delete req.session.user

    req.session.user = { id, name, email, role: user.role }

    console.log('Profile edited!')
    req.flash('notification', 'Profil berhasil diubah.')
    return res.redirect('/profile')
  } catch (e) {
    console.error('editing profile error!', e)
    req.flash('notification', 'Gagal mengubah profile, silahkan coba lagi.')
    return res.redirect('/profile')
  }
}

exports.updatePassword = async (req, res) => {
  try {
    const { password, passwordConfirmation, oldPassword } = req.body
    const { id } = req.session.user

    const user = await User.findById(id)

    if (!user) {
      console.log(`user not found!`)
      req.flash('notification', `User tidak ditemukan.`)
      return res.redirect('/profile')
    }

    if (user.password !== oldPassword) {
      console.log(`old password incorrect.`)
      req.flash('notification', `Gagal melakukan autentikasi, password salah.`)
      return res.redirect('/profile')
    }

    if (password !== passwordConfirmation) {
      console.log(`password confirmation failed.`)
      req.flash(
        'notification',
        `Konfirmasi password baru gagal, password tidak sama.`
      )
      return res.redirect('/profile')
    }

    await User.findByIdAndUpdate(id, { $set: { password } })

    console.log(`Update password success.`)
    req.flash('notification', `Password berhasil diperbarui.`)
    return res.redirect('/')
  } catch (error) {
    console.log(`update password error.`, e)
    req.flash(
      'notification',
      `Terjadi kesalahan saat mencoba memperbarui password, coba lagi.`
    )
    return res.redirect('/profile')
  }
}

exports.search = async (req, res) => {
  try {
    const { field, query } = req.body

    if (field === 'name') {
      return res.redirect(`/user?field=${field}&query=${query}`)
    }
    if (field === 'email') {
      return res.redirect(`/user?field=${field}&query=${query}`)
    }
    if (field === 'role') {
      return res.redirect(`/user?field=${field}&query=${query}`)
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
