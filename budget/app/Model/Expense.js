'use strict'

const Lucid = use('Lucid')

class Expense extends Lucid {

    user () {
        return this.hasOne('App/Model/User');
    }

    category () {
        return this.hasOne('App/Model/Category');
    }
}

module.exports = Expense
