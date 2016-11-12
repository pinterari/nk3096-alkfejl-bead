'use strict'

const Lucid = use('Lucid')

class Category extends Lucid {

    expenses () {
        return this.hasMany('App/Model/Expense');
    }

}

module.exports = Category
