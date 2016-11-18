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

  allocated_funds (){
    return this.hasMany('App/Model/AllocatedFund');
  }

  static get rules () {
      return {
          username: 'required|alpha_numeric|unique:users',
          email: 'required|email|unique:users',
          password: 'required|min:4',
          passwordAgain: 'required|same:password'
      }
  };

}

module.exports = User;
