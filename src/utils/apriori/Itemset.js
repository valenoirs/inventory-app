'use strict';

class Itemset extends Array {
    constructor() {
        super();
    }
    
    gabungkanItemset(itemset) {
        for (var i = 0; i < itemset.length; i += 1) {
            var item = itemset[i];
            if (!this.includes(item)) {
                return false;
            }
        }
        //console.log(itemset);
        return true;
    }

    hapusItemset(itemset) {
        var hapus = new Itemset();
        for (var i = 0; i < this.length; i += 1) {
            var item = this[i];
            if (!itemset.includes(item)) {
                hapus.push(item);
            }
        }
        //console.log(itemset);
        return hapus;
    }
}


module.exports = Itemset