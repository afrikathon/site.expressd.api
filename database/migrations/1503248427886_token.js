'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TokensSchema extends Schema {
    up() {
        this.create('tokens', (collection) => {
            collection.increments()
            collection.integer('user_id').unsigned().references('id').incollection('users')
            collection.string('token', 255).notNullable().unique().index()
            collection.string('type', 80).notNullable()
            collection.boolean('isactive').defaultTo(false)
            collection.timestamps()
        })
    }

    down() {
        this.drop('tokens')
    }
}

module.exports = TokensSchema