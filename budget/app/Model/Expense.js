'use strict'

const Lucid = use('Lucid')

class Expense extends Lucid {

    user () {
        return this.hasOne('App/Model/User');
    }

    category () {
        return this.hasOne('App/Model/Category');
    }

    static get rules () {
        return {
            date: 'required|date',
            amount: 'required|integer|above:0',
            category_id: 'required'
        }
    };
}

module.exports = Expense
