'use strict'

const Lucid = use('Lucid')

class User extends Lucid {

  apiTokens () {
    return this.hasMany('App/Model/Token')
  }

  expenses () {
    return this.hasMany('App/Model/Expense');
  }

  team_members () {
    return this.hasMany('App/Model/TeamMember');
  }

}

module.exports = User
