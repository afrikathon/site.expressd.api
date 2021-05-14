'use strict'
const Payement = use('App/Models/BookPayement');
const Agent = use('App/Models/Agent');
const Hash = use('Hash');
const Logger = use('Logger')
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with bookpayements
 */
class BookPayementController {
    /**
     * Show a list of all bookpayements.
     * GET bookpayements
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     * @param {View} ctx.view
     */
    async index({ auth, params, request, response, view }) {
        try {
            const isauth = await auth.check()
            if (isauth) {
                //Check if he is admin
                let getter_id = params.getter_id
                var id = getter_id;
                const agent = await Agent.find(id);
                if (agent == null || (agent.status != 53000 && agent.status != 23000 && agent.status != 85412 && agent.status != 998954)) { // he has right to read all payement
                    return response.status(401).json({
                        error: true,
                        message: 'You haven\'t right, please send valid id(2)!'
                    });
                }
                const payements = await Payement.all();
                return response.status(200).json({
                    error: false,
                    message: "all payements returned",
                    payements: payements
                });
            } else {
                return response.status(401).json({
                    error: true,
                    message: 'Missing or d jwt token'
                });
            }

        } catch (error) {
            return response.status(401).json({
                error: true,
                message: 'Missing or invalid jwt token'
            });
        }
    }


    /**
     * Display all bookpayement for user.
     * GET bookpayements/book/:user_id
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     * @param {View} ctx.view
     */
    async showuserallpayement({auth, params, request, response, view }) {
        try {
            const isauth = await auth.check()
            if (isauth) {
                const user_id = params.user_id;
                if (user_id == null) {
                    return response.status(401).json({
                        error: true,
                        message: 'Please send your id!'
                    });
                }
                const payements = await Payement.findBy('user_id', user_id);
                if (payements) {
                    return response.status(200).json({
                        error: false,
                        message: "Payements got!",
                        payement: payements,
                    });
                } else {
                    return response.status(401).json({
                        error: true,
                        message: "This payements not exit!",
                    });
                }

            } else {
                return response.status(401).json({
                    error: true,
                    message: "Can't get payement ! please send valid token",
                });
            }
        } catch (error) {
            return response.status(401).json({
                error: true,
                message: 'Missing or invalid jwt token'
            });
        }
    }



    /**
     * Create/save a new bookpayement.
     * POST bookpayements
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     */
    // collection.string('payement_number', 255).notNullable().unique()
    // collection.string('payement_channel', 255).notNullable()
    // collection.integer('user_id').unsigned().references('id').incollection('users')
    // collection.integer('collector_id').unsigned().references('id').incollection('users')
    async store({auth, request, response }) {
        try {
            var {
                payement_number,
                payement_channel,
                user_id,
                collector_id,
                booking_id,
                amount,
                secret
            } = request.post();

            if (payement_number == null || payement_channel == null || user_id == null || collector_id == null || booking_id == null || amount == null || secret == null) {
                return response.status(401).json({
                    error: true,
                    message: 'Data invalid'
                });
            }

            let secretkey = "YA ILAHI TAWAKELNA ALA LA";
            secret = secretkey;
            //chaque jour de payement généré une nouvelle clé de payement pour les users et/ou les employés
            if (secret != secretkey) {
                return response.status(501).json({
                    error: true,
                    message: 'Forbidden!'
                });
            }
            const isauth = await auth.check();
            //console.log(auth.check());
            if (isauth) {
                //Check if he is admin
                let id = collector_id;
                const agent = await Agent.find(id);
                if (agent == null || agent.status != 23000) {
                    return response.status(401).json({
                        error: true,
                        message: 'You haven\'t right, please send valid id!'
                    });
                }

                let payementlengthbefore;
                let payementlength;
                if (await Payement.count()) {
                    payementlengthbefore = await Payement.count('id')
                    payementlength = +(payementlengthbefore[0]["count"]) + 1;
                } else {
                    payementlength = 1;
                }
                //Save payement

                //Logger
                Logger.info('Updated one payement' + new Date());

                //save new information
                const isachieve = 1;
                const payement = await Payement.create({
                    payement_id: payementlength,
                    payement_number,
                    payement_channel,
                    booking_id,
                    user_id,
                    collector_id,
                    amount
                });
                return response.status(200).json({
                    error: false,
                    message: "Payement created!",
                    payement: payement.id,
                    payement: payement,
                });
            } else {
                return response.status(401).json({
                    error: true,
                    message: 'Missing or d jwt token'
                });
            }
        } catch (error) {
            return response.status(500).json({
                message: "An error occured",
            });
        }

    }

    /**
     * Display a single bookpayement.
     * GET bookpayements/:id
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     * @param {View} ctx.view
     */
    async show({ params, request, response, view }) {
        try {
            const isauth = await auth.check()
            if (isauth) {
                //Check if he is admin
                const payement_id = params.id;
                if (payement_id == null) {
                    return response.status(401).json({
                        error: true,
                        message: 'Payement not exist, please send valid id(1)!'
                    });
                }
                let id = payement_id;
                const payement = await Payement.find(id);
                if (payement) {
                    return response.status(200).json({
                        error: false,
                        message: "Payement got",
                        id: payement.id,
                        payement: payement,
                    });
                } else {
                    return response.status(401).json({
                        error: true,
                        message: "This payement not exit!",
                    });
                }

            } else {
                return response.status(401).json({
                    error: true,
                    message: "Can't get payement ! please send valid token",
                });
            }
        } catch (error) {
            return response.status(401).json({
                error: true,
                message: 'Missing or invalid jwt token'
            });
        }
    }


    /**
     * Display a single bookpayement for user.
     * GET bookpayement/book/:payement_id/:user_id
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     * @param {View} ctx.view
     */
    async showuseronepayement({ params, request, response, view }) {
        try {
            const isauth = await auth.check()
            const user_id = params.user_id;
            const payement_id = params.payement_id;
            if (isauth) {
                //Check if he is admin
                if (payement_id == null || user_id == null) {
                    return response.status(401).json({
                        error: true,
                        message: 'Please send valid id(1)!'
                    });
                }
                let id = user_id;
                const user = await User.find(id);
                if (user == null) {
                    return response.status(401).json({
                        error: true,
                        message: 'You haven\'t right, please send valid id(2)!'
                    });
                }
                const payement = await Payement.find(payement_id);
                if (payement) {
                    return response.status(200).json({
                        error: false,
                        message: "Payement got",
                        id: payement.id,
                        payement: payement,
                    });
                } else {
                    return response.status(401).json({
                        error: true,
                        message: "This payement not exit!",
                    });
                }

            } else {
                return response.status(401).json({
                    error: true,
                    message: "Can't get payement ! please send valid token",
                });
            }
        } catch (error) {
            return response.status(401).json({
                error: true,
                message: 'Missing or invalid jwt token'
            });
        }
    }


    /**
     * Update bookpayement details.
     * PUT or PATCH bookpayements/:id
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     */
    async update({ auth, params, request, response }) {
        try {
            const bookpayement_id = params.id;

            if (bookpayement_id == null) {
                return response.status(401).json({
                    error: true,
                    message: 'Booking id invalid, please send valid id(1)!'
                });
            }


            var {
                payement_number,
                payement_channel,
                user_id,
                collector_id,
                booking_id,
                amount,
                secret
            } = request.post();

            if (payement_number == null || payement_channel == null || user_id == null || collector_id == null || booking_id == null || amount == null || secret == null) {
                return response.status(401).json({
                    error: true,
                    message: 'Data invalid!'
                });
            }

            const isauth = await auth.check();
            //console.log(auth.check());
            if (isauth) {

            //get payement & update
            console.log(booking_id)
            let id = bookpayement_id;
            var payement = await Payement.find(id);
                // console.log(payement)
            if (!payement) {
                return response.status(401).json({
                    error: true,
                    message: "Payement not exist, retry(2)!",
                });
            }

            let secretkey = "YA ILAHI TAWAKELNA ALA LA";
            secret = secretkey;
            //chaque jour de payement généré une nouvelle clé de payement pour les users et/ou les employés
            if (secret != secretkey) {
                return response.status(501).json({
                    error: true,
                    message: 'Forbidden!'
                });
            }

            //Check if he is admin
            const agent = await Agent.find(collector_id);
            if (agent == null || agent.status != 23000) {
                return response.status(401).json({
                    error: true,
                    message: 'You haven\'t right, please send valid id!'
                });
            }

                //Logger
                Logger.info('Updated one payement' + new Date());

                //get new data payement
                payement.payement_number = payement_number == null ? payement.payement_number : payement_number;
                payement.payement_channel = payement.payement_channel == null ? payement.payement_channel : payement_channel;
                payement.user_id = user_id == null ?  payement.user_id : user_id;
                payement.collector_id = collector_id ==null ?  payement.collector_id : collector_id;
                payement.booking_id = booking_id == null ? payement.booking_id : booking_id;
                payement.amount = amount ==null ?  payement.amount: amount;;
                payement.secret = secret == null? payement.secret : secret;

                //save new information
                const resp = await payement.save();
                return response.status(200).json({
                    error: false,
                    message: "Payement updated!",
                    payement: payement.id,
                    payement: payement,
                });
            } else {
                return response.status(401).json({
                    error: true,
                    message: 'Missing or d jwt token'
                });
            }
        } catch (error) {
          return response.status(500).json({
                message: "An error occured",
            });
        }
    }

    /**
     * We didn't delete the payement
     * Delete a bookpayement with id.
     * DELETE bookpayements/:id
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     */
    //async destroy({ params, request, response }) {}
}

module.exports = BookPayementController
