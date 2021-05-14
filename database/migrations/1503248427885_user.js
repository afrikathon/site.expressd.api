'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UserSchema extends Schema {
    up() {
        this.create('users', (collection) => {
            collection.increments()
            collection.string('firstname', 80).nullable()
            collection.string('lastname', 80).nullable()
            collection.string('username', 80).nullable()
            collection.string('phone', 15).notNullable().unique()
            collection.string('email', 254).nullable()().unique()
            collection.string('password', 255).notNullable()
            collection.boolean('isactive').defaultTo(true)
            collection.integer('status').defaultTo(10000) //10000 == user; 53000 == comptable ; 23000 == collector; 85412 === admin, 998954 == super-admin
            collection.integer('longitude').defaultTo(0)
            collection.integer('latitude').defaultTo(0)
            collection.string('code').defaultTo(225)
            collection.timestamps()
        })
    }

    down() {
        this.drop('users')
    }
}

module.exports = UserSchema
