'use strict'

const Lucid = use('Lucid')

class AllocatedFund extends Lucid {

    savings_plan(){
        this.belongsTo('App/Model/SavingsPlan')
    }

    user(){
        this.belongsTo('App/Model/User')
    }
}

module.exports = AllocatedFund
