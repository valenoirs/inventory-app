'use strict'

const Itemset = require('./Itemset')

class AssociationRules {
  constructor() {
    this.X = new Itemset()
    this.Y = new Itemset()
    this.Support = 0.0
    this.Confidence = 0.0
  }
}

module.exports = AssociationRules
