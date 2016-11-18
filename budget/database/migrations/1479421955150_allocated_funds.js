'use strict'

const Schema = use('Schema')

class AllocatedFundsTableSchema extends Schema {

  up () {
    this.create('allocated_funds', (table) => {
      table.increments()
      table.integer('plan_id')
      table.string('username')
      table.integer('amount')
      table.date('date')
      table.timestamps()
    })
  }

  down () {
    this.drop('allocated_funds')
  }

}

module.exports = AllocatedFundsTableSchema
