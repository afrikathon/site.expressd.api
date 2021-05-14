'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')
class BookPayementSchema extends Schema {
    up() {
        this.create('book_payements', (collection) => {
            collection.increments()
            collection.string('payement_number', 255).notNullable().unique()
            collection.string('payement_channel', 255).notNullable()
            collection.string('amount', 255).notNullable()
            collection.integer('user_id').unsigned().references('id').incollection('users')
            collection.integer('collector_id').unsigned().references('id').incollection('agents')
            collection.integer('booking_id').unsigned().references('id').incollection('bookings')
            collection.timestamps()
        })
    }

    down() {
        this.drop('book_payements')
    }
}



module.exports = BookPayementSchema