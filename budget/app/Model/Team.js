'use strict'

const Lucid = use('Lucid')

class Team extends Lucid {

    team_members () {
        return this.hasMany('App/Model/TeamMember');
    }

}

module.exports = Team
