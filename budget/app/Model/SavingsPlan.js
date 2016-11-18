'use strict'

const Lucid = use('Lucid')

class SavingsPlan extends Lucid {

    team (){
        this.belongsTo('App/Model/Team');
    }

    allocated_funds (){
        this.hasMAny('App/Model/AllocatedFund');
    }
}

module.exports = SavingsPlan
