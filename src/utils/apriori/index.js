const ItemsetCollections = require('./ItemsetCollections')
const Itemset = require('./Itemset.js')
const Apriori = require('./Apriori')

exports.getApriori = function getApriori(ruangan, dataset, s, c) {
  // first iteration transform data into itemset collections
  let db = new ItemsetCollections()

  let datasetAndItemsetTable = []

  for (var i in dataset) {
    datasetAndItemsetTable.push({
      dataset: ruangan[i]['name'],
      itemset: dataset[i],
    })
    let items = dataset[i].split(', ')
    db.push(Itemset.from(items))
  }

  console.log('Data:')
  console.table(datasetAndItemsetTable)

  // get support item
  let supportData = parseFloat(s)
  let itemSupport = Apriori.getSupport(db, supportData)

  // get confidence item
  let confidenceData = parseFloat(c)
  let allRules = Apriori.getConfidence(db, itemSupport, confidenceData)

  let itemSupportTable = []

  itemSupport.sort((a, b) => a.Support - b.Support)

  itemSupport.forEach((itemset) => {
    if (itemset.length < 2) {
      itemSupportTable.push({
        itemset: itemset[0],
        support: itemset.Support,
      })
      return
    }

    itemSupportTable.push({
      itemset: itemset.join(', '),
      support: itemset.Support,
    })
  })

  console.log('Final ItemSet Support After Threshold:')
  console.table(itemSupportTable)

  console.log('Association Rules')
  console.table(allRules)

  return {
    itemSupport,
    allRules,
  }
}
