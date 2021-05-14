'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class EmpPayementSchema extends Schema {
    up() {
        this.create('emp_payements', (table) => {
            collection.increments()
            collection.string('payement_number', 255).notNullable().unique()
            collection.string('payement_channel', 255).notNullable()
            collection.string('amount', 255).notNullable()
            collection.integer('emp_id').unsigned().references('id').incollection('users')
            collection.string('comptable_id', 255).notNullable();
            collection.string('description', 255).notNullable();
            //collection.string('secret', 255).notNullable(); //hasher la clé secrète generer chaque jour
            collection.timestamps()
        })
    }

    down() {
        this.drop('emp_payements')
    }
}

module.exports = EmpPayementSchema