'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class BookingSchema extends Schema {
    up() {
        this.create('bookings', (table) => {
            collection.increments()
                //collection.integer('user_id').unsigned().references('id').incollection('users')
            collection.string('user_id', 255)
            collection.string('longitude_user', 255).notNullable()
            collection.string('latitude_user', 255).defaultTo(0)
                //collection.string('collector_id').unsigned().references('id').incollection('users')
            collection.string('collector_id', 255);
            collection.string('longitude_collector', 255).defaultTo(0)
            collection.string('latitude_collector', 255).defaultTo(0)
            collection.boolean('isachieve').defaultTo(false)
            collection.integer('amount').notNullable()
            collection.string('begin', 5).nullable()
            collection.string('end', 5).nullable()
            collection.timestamps()
        })
    }

    down() {
        this.drop('bookings')
    }
}

module.exports = BookingSchema