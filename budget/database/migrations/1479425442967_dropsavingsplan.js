'use strict'

const Schema = use('Schema')

class DropsavingsplanTableSchema extends Schema {

  up () {
    this.drop('savings_plan')
  }

  down () {
    this.drop('savings_plan')
  }

}

module.exports = DropsavingsplanTableSchema
