'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AgentSchema extends Schema {
    up() {
        this.create('agents', (collection) => {
            collection.increments()
            collection.string('firstname', 255).notNullable()
            collection.string('lastname', 255).notNullable()
            collection.string('username', 255).nullable()
            collection.string('phone', 15).notNullable().unique()
            collection.string('email', 255).nullable()().unique()
            collection.string('password', 255).notNullable()
            collection.boolean('isactive').defaultTo(true)
            collection.integer('status').defaultTo(23000) //10000 == user; 53000 == comptable ; 23000 == collector; 85412 === admin, 998954 == super-admin
            collection.integer('longitude').defaultTo(0)
            collection.integer('latitude').defaultTo(0)
            collection.timestamps()
        })
    }

    down() {
        this.drop('agents')
    }
}

module.exports = AgentSchema