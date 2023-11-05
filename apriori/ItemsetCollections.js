'use strict'

const Itemset = require('./Itemset.js')

class ItemsetCollections extends Array {
  constructor() {
    super()
  }

  getItemUnik() {
    let itemUnik = new Itemset()

    for (var index in this) {
      let itemset = this[index]
      for (var i = 0; i < itemset.length; i += 1) {
        if (!itemUnik.includes(itemset[i])) {
          itemUnik.push(itemset[i])
        }
      }
    }

    //console.log(itemUnik);

    return itemUnik
  }

  cariAprioriSupport(itemset) {
    let matchCount = 0
    for (var index in this) {
      let is = this[index]
      if (is.gabungkanItemset(itemset)) {
        matchCount += 1
      }
    }

    let support = (matchCount / this.length) * 100.0
    // console.log(support);
    return support
  }

  clear() {
    this.length = 0
  }
}

module.exports = ItemsetCollections
