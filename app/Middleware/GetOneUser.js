'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

class GetOneUser {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle ({ request }, next) {
    const {email} = request.only(['email'])
    // call next to advance the request``
     const user =  await User
    .where('email').eq(email)
    .first()
    await next()
  }
}

module.exports = GetOneUser
