'use strict'

const Schema = use('Schema')

class TeamMembersTableSchema extends Schema {

  up () {
    this.create('team_members', (table) => {
      table.increments()
      table.integer('team_id')
      table.string('username')
      table.boolean('is_supervisor')
      table.timestamps()
    })
  }

  down () {
    this.drop('team_members')
  }

}

module.exports = TeamMembersTableSchema
