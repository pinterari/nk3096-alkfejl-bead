'use strict'

const Schema = use('Schema')

class SavingsPlansTableSchema extends Schema {

  up () {
    this.create('savings_plans', (table) => {
      table.increments()
      table.integer('team_id')
      table.string('name')
      table.integer('goal')
      table.integer('current')
      table.boolean('is_fulfilled')
      table.timestamps()
    })
  }

  down () {
    this.drop('savings_plans')
  }

}

module.exports = SavingsPlansTableSchema
