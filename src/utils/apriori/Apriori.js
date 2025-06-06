'use strict'

const ItemsetCollections = require('./ItemsetCollections')
const Itemset = require('./Itemset')
const Bit = require('./Bit')
const AssociationRules = require('./AssociationRules')

class Apriori {
  static getSupport(db, supportData) {
    let itemUnik = db.getItemUnik()
    let itemSupportDua = new ItemsetCollections()
    let itemSupportTiga = new ItemsetCollections()
    let tandaItemIterasi = new ItemsetCollections()
    let supportDataTable = []

    for (var i = 0; i < itemUnik.length; i += 1) {
      itemSupportDua.push(Itemset.from([itemUnik[i]]))
    }

    let k = 2
    while (itemSupportDua.length != 0) {
      tandaItemIterasi.clear()
      for (var index in itemSupportDua) {
        let itemset = itemSupportDua[index]
        let aprioriSupportResult = db.cariAprioriSupport(itemset)
        supportDataTable.push(aprioriSupportResult)
        itemset.Support = aprioriSupportResult.support
        if (itemset.Support >= supportData) {
          tandaItemIterasi.push(itemset)
          itemSupportTiga.push(itemset)
        }
      }

      itemSupportDua.clear()
      let subsets = Bit.findSubsets(tandaItemIterasi.getItemUnik(), k)
      subsets.forEach((set) => itemSupportDua.push(set))
      k++
    }

    console.log('ItemSet Support Calculation:')
    console.table(supportDataTable.sort((a, b) => a.support - b.support))

    return itemSupportTiga
  }

  static getConfidence(db, L, confidenceThreshold) {
    let allRules = []

    for (var i in L) {
      let itemset = L[i]
      let subsets = Bit.findSubsets(itemset, 0)
      for (var j in subsets) {
        let subset = subsets[j]

        let confidence =
          (db.cariAprioriSupport(itemset).support /
            db.cariAprioriSupport(subset).support) *
          100.0
        if (confidence >= confidenceThreshold) {
          let rule = new AssociationRules()
          subset.forEach((i) => rule.X.push(i))
          itemset.hapusItemset(subset).forEach((i) => rule.Y.push(i))
          rule.Support = db.cariAprioriSupport(itemset).support
          rule.Confidence = confidence

          if (rule.X.length > 0 && rule.Y.length > 0) {
            allRules.push(rule)
          }
        }
      }
    }

    return allRules
  }
}

module.exports = Apriori
