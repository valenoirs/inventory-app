const ItemsetCollections = require('./ItemsetCollections')
const Itemset = require('./Itemset.js')
const Apriori = require('./Apriori')

exports.getApriori = function getApriori(dataset, s, c) {
  // first iteration transform data into itemset collections
  let db = new ItemsetCollections()

  for (var i in dataset) {
    let items = dataset[i].split(', ')
    db.push(Itemset.from(items))
  }

  // get support item
  let supportData = parseFloat(s)
  let itemSupport = Apriori.getSupport(db, supportData)

  // get confidence item
  let confidenceData = parseFloat(c)
  let allRules = Apriori.getConfidence(db, itemSupport, confidenceData)

  return {
    itemSupport,
    allRules,
  }
}
