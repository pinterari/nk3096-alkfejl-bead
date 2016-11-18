'use strict'

const Schema = use('Schema')

class ModifydbTableSchema extends Schema {

  up () {
    this.table('users', (table) => {
       table.dropColumn('picture')
    })

  }

  down () {
    this.table('users', (table) => {
       table.dropColumn('pictrue')
    })
  }

}

module.exports = ModifydbTableSchema
