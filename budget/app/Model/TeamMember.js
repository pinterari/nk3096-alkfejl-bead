'use strict'

const Lucid = use('Lucid')

class TeamMember extends Lucid {

    users () {
        return this.hasMany('App/Model/User');
    }

    teams () {
        return this.hasMany('App/Model/Team');
    }

}

module.exports = TeamMember
