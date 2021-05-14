'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class WalletSchema extends Schema {
    up() {
        this.create('wallets', (collection) => {
            collection.increments()
            collection.integer('user_id').unsigned().references('id').incollection('users')
            collection.integer('amount').notNullable()
            collection.string('wallet_number', 255).notNullable().unique()
            collection.string('paypal', 255).nullable().unique()
            collection.string('bank', 255).nullable().unique()
            collection.string('mobile', 255).nullable().unique()
            collection.boolean('is_active').defaultTo(true)
            collection.string('secret', 255).notNullable(); //hasher la clé secrète
            collection.string('usermongoid', 255).notNullable(); //hasher la clé secrète
            collection.timestamps()
        })
    }

    down() {
        this.drop('wallets')
    }
}

module.exports = WalletSchema
