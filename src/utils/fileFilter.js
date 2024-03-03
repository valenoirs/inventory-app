const filter = (ext) => {
  if (ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg' && ext !== '.webp') {
    return true
  }

  return false
}

module.exports = filter
