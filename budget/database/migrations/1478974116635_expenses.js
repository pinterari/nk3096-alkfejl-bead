'use strict'

const Schema = use('Schema')

class ExpensesTableSchema extends Schema {

  up () {
    this.create('expenses', (table) => {
      table.increments()
      table.string('username').notNullable()
      table.integer('amount').notNullable()
      table.integer('category_id').notNullable()
      table.string('comment')
      table.date('date').notNullable
      table.timestamps()
    })
  }

  down () {
    this.drop('expenses')
  }

}

module.exports = ExpensesTableSchema
