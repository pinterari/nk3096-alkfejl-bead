'use strict'

const Lucid = use('Lucid')

class Team extends Lucid {

    team_members () {
        return this.hasMany('App/Model/TeamMember');
    }

    savings_plans(){
        return this.hasMany('App/Model/SavingsPlan');
    }

}

module.exports = Team
