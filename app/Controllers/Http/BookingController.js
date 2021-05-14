'use strict'
const Booking = use('App/Models/Booking')
const Agent = use('App/Models/Agent');
const Hash = use('Hash')
const Logger = use('Logger');
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with bookings
 */
class BookingController {
    /**
     * Show a list of all bookings.
     * GET bookings
     *bookings/:collector_id
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     * @param {View} ctx.view
     */
    async index({auth, params, request, response, view }) {

        try {
            const collector_id = params.collector_id;
            if (collector_id == null) {
                return response.status(401).json({
                    error: true,
                    message: 'You haven\'t right, please send valid id(1)!'
                });
            }
            const isauth = await auth.check()
            console.log(auth.check());

            if (isauth) {
                //Check if he is admin
                let id = collector_id;
                const agent = await Agent.find(id);
                if (agent == null || agent.status != 23000) { // is agent & is has right to read bookings
                    return response.status(401).json({
                        error: true,
                        message: 'You haven\'t right, please send valid id(2)!'
                    });
                }
                const bookings = await Booking.all();
                return response.json({
                    error: false,
                    message: "all bookings returned",
                    bookings: bookings
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
     * Create/save a new booking.
     * POST bookings
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     */
    async store({ auth, request, response }) {
        try {
            const {
                user_id,
                longitude_user,
                latitude_user,
                collector_id,
                longitude_collector,
                latitude_collector,
                amount,
                begin,
                end
            } = request.post();


            if (user_id == null || longitude_user == null || latitude_user == null || collector_id == null || longitude_collector == null || latitude_collector == null ||
                isachieve == null || amount == null || begin == null || end == null) {
                return response.status(401).json({
                    error: true,
                    message: 'Data invalid'
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
                        message: 'You haven\'t right, please send valid id(1)!'
                    });
                }

                let bookinglengthbefore;
                let bookinglength;
                if (await Booking.count()) {
                    bookinglengthbefore = await Booking.count('id')
                    bookinglength = +(bookinglengthbefore[0]["count"]) + 1;
                } else {
                    bookinglength = 1;
                }
                //Logger
                Logger.info('Updated one booking' + new Date());

                //save new information
                const isachieve = 1;
                const booking = await Booking.create({
                    booking_id: bookinglength,
                    user_id: user_id,
                    longitude_user: longitude_user,
                    latitude_user: latitude_user,
                    collector_id: collector_id,
                    longitude_collector: longitude_collector,
                    latitude_collector: latitude_collector,
                    isachieve: isachieve,
                    amount: amount,
                    begin: begin,
                    end: end
                });
                return response.status(200).json({
                    error: false,
                    message: "Booking create",
                    booking: booking.id,
                    booking: booking,
                });
            } else {
                return response.status(401).json({
                    error: true,
                    message: 'Missing or d jwt token(1)'
                });
            }

        } catch (error) {
            return response.status(401).json({
                error: true,
                message: 'Missing or invalid jwt token(2)'
            });
        }
    }

    /**
     * Display a single booking.
     * GET bookings/:id
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
                const booking_id = params.id;
                if (booking_id == null) {
                    return response.status(401).json({
                        error: true,
                        message: 'Booking not exist, please send valid id(1)!'
                    });
                }
                let id = collector_id;
                const agent = await Agent.find(id);
                if (agent == null || agent.status != 23000) { // is agent & is has right to read bookings
                    return response.status(401).json({
                        error: true,
                        message: 'You haven\'t right, please send valid id(2)!'
                    });
                }
                const booking = await Booking.find(booking_id);
                if (booking) {
                    return response.status(200).json({
                        error: false,
                        message: "User got",
                        id: booking.id,
                        booking: booking,
                    });
                } else {
                    return response.status(401).json({
                        error: true,
                        message: "This booking not exit!",
                    });
                }

            } else {
                return response.status(401).json({
                    error: true,
                    message: "Can't get booking ! please send valid token",
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
     * Update booking details.
     * PUT or PATCH bookings/:id
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     */
    async update({ auth, params, request, response }) {
        try {
            const booking_id = params.id;
            if (booking_id == null || !booking_id) {
                return response.status(401).json({
                    error: true,
                    message: 'Booking not exist, please send valid id(1)!'
                });
            }
            //get booking & update
            let id = booking_id;
            var booking = await Booking.find(id);
            if (!booking) {
                return response.status(401).json({
                    error: true,
                    message: "Booking not exist, retry(2)!",
                });
            }

            const {
                user_id,
                longitude_user,
                latitude_user,
                collector_id,
                longitude_collector,
                latitude_collector,
                amount,
                begin,
                end,
                isachieve
            } = request.post();


            if (user_id == null || longitude_user == null || latitude_user == null || collector_id == null || longitude_collector == null || latitude_collector == null ||
                isachieve == null || amount == null || begin == null || end == null) {
                return response.status(401).json({
                    error: true,
                    message: 'Data invalid'
                });
            }
            const isauth = await auth.check();
            //console.log(auth.check());
            if (isauth) {
                //Check if he is admin
                let id = collector_id;
                var agent = await Agent.find(id);

                if (agent == null || agent.status != 23000) {
                    return response.status(401).json({
                        error: true,
                        message: 'You haven\'t right, please send valid id!'
                    });
                }

                // var booking = await Booking.find(id);
                //const isachieve = 1;
                //get new data booking
                booking.user_id =  user_id == null ? booking.user_id : user_id;
                booking.longitude_user = longitude_user;
                booking.latitude_user = latitude_user;
                booking.collector_id = collector_id
                booking.longitude_collector = longitude_collector;
                booking.latitude_collector = latitude_collector;
                booking.amount = amount;
                booking.begin = begin;
                booking.endagent = end;
                booking.isachieve = isachieve  == null ? agent.isachieve : isachieve;
                //save new information
                const resp = await booking.save();

                //Logger
                Logger.info('Updated one booking' + new Date());
                return response.status(200).json({
                    error: false,
                    message: "Booking updated",
                    booking: resp.id,
                    booking: resp,
                });
            } else {
                return response.status(401).json({
                    error: true,
                    message: 'Missing or d jwt token(1)!'
                });
            }

        } catch (error) {
            return response.status(401).json({
                error: true,
                message: 'Missing or invalid jwt token(2)!'
            });
        }
    }

    /**
     * Delete a booking with id.
     * DELETE bookings/:id/:collector_id
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     */
    async destroy({auth, params, request, response }) {
        try {
            const isauth = await auth.check()
            if (isauth) {
                const booking_id = params.id;
                if (booking_id == null) {
                    return response.status(401).json({
                        error: true,
                        message: 'Booking not exist, please send valid id!'
                    });
                }
                const collector_id = params.collector_id;
                if (collector_id == null) {
                    return response.status(401).json({
                        error: true,
                        message: 'Booking not exist, please send valid id(1)!'
                    });
                }
                //Check if he is admin
                let id = collector_id;
                const agent = await Agent.find(id);
                if (agent == null || agent.status != 23000) {
                    return response.status(401).json({
                        error: true,
                        message: 'You haven\'t right, please send valid id!(2)'
                    });
                }

                id = booking_id;
                const booking = await Booking.find(id);

                if (booking) {
                    await booking.delete()
                        //delete user wallet && all his information
                    return response.status(200).json({
                        error: false,
                        message: "Booking deleted",
                        id: booking.id,
                        booking: booking,
                    });
                } else {
                    return response.status(401).json({
                        error: true,
                        message: 'Missing or d jwt token'
                    });
                }

            }
        } catch (error) {
            return response.status(401).json({
                error: true,
                message: 'Missing or invalid jwt token'
            });
        }
    }
}

module.exports = BookingController
