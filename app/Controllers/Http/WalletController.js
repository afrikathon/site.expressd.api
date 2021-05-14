'use strict'
const Wallet = use('App/Models/Wallet');
const Hash = use('Hash')

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with wallets
 */
class WalletController {
    /**
     * Show a list of all wallets.
     * GET wallets
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     * @param {View} ctx.view
     */
    async index({ request, response, view }) {}


    /**
     * Create/save a new wallet.
     * POST wallets
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     */
    //     async store({ request, response }) {
    //         const wallet = await Wallet.create({ user_id: userlength, usermongoid: user['_id'], amount: 0, wallet_number: wallet_number, paypal: null, bank: null, mobile: user.phone, is_active: true });
    //         response.status(200).json({
    //             error: false,
    //             message: "User & Wallet created",
    //             id: userlength,
    //             user: user,
    //             wallet: wallet
    //         });
    // }

    /**
     * Display a single wallet.
     * POST wallet/getwallet
     * user_id & secret
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     * @param {View} ctx.view
     */
    async show({auth, params, request, response, view }) {
        try {
          // console.log(auth)

            const { user_id, secret } = request.post()
            console.log(request.post())
            if(!user_id || !secret){
              return  response.status(401).json({
                error: true,
                message: "Please send user id and secret key!",
            });
            }

            const isauth = await auth.check()
            if (isauth) {
                // const user_id = params.user_id;
                // var wallet = await Wallet.findBy('user_id', +user_id);
                var usermongoid = user_id

              var  wallet =  await Wallet.findBy("usermongoid", user_id);

              console.log(wallet)
                if (wallet) {
                    //const isSame = await Hash.verify(secret, wallet.secret);
                    var isSame = true;
                    if (isSame) {
                        return response.status(200).json({
                            error: false,
                            message: "Wallet got",
                            id: wallet.id,
                            wallet: wallet,
                        });
                    } else {
                        return response.status(401).json({
                            error: true,
                            message: "Forbidden, code invalid!",
                        });
                    }

                } else {
                    return response.status(401).json({
                        error: true,
                        message: "This wallet don't exit!",
                    });
                }

            } else {
                return response.status(401).json({
                    error: true,
                    message: "Can't get wallet ! please send valid token",
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
     * Update wallet details.
     * PUT or PATCH wallets/:id
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     */
    async update({ params, request, response }) {
        //get data
        //fill wallet
        //update wallet
        try {
            const { wallet_number, paypal, bank, user_mobile_account ,new_secret,old_secret, isactive, amount } = request.post();

            if (!wallet_number || wallet_number === null || wallet_number == 'null') {
                return response.status(401).json({
                    error: true,
                    message: "Wallet doesn't exist(1) "
                });
            }

            console.log(user_mobile_account ==null);
            if (user_mobile_account == null ) {
              return response.status(401).json({
                  error: true,
                  message: "The phone number is invalid!",
              });
          }
            var regexNumber = /((\+)[1-9]{2})[1-9](\d{2}){4}/;
            if ((user_mobile_account !== null || user_mobile_account === "null")  && !user_mobile_account.match(regexNumber)) {
                return response.status(401).json({
                    error: true,
                    message: "The phone number is invalid!",
                });
            }
            var walletFind = await Wallet.findBy('wallet_number', wallet_number);
            // console.log(walletFind)
            if (!walletFind) {
              return response.status(401).json({
                  error: true,
                  message: "Wallet doesn't exist (2)"
              });
          }
            if(walletFind.secret !== old_secret){
                return response.status(401).json({
                  error: true,
                  message: "Old password is invalid!"
              });
            }
            walletFind.amount = amount == null ? walletFind.amount : amount;
            walletFind.paypal = paypal == null ? walletFind.paypal : paypal;
            walletFind.bank = bank == null ? walletFind.bank : bank;;
            walletFind.user_mobile_account = user_mobile_account ==null ? walletFind.user_mobile_account : user_mobile_account;
            walletFind.is_active = isactive == null ? walletFind.isactive : isactive;
            walletFind.secret = new_secret == null ? walletFind.secret : new_secret;
            const resp = await walletFind.save();
            return response.status(200).json({
                error: false,
                message: "Wallet updated!",
                wallet: walletFind,
            });
        } catch (error) {
            return response.status(500).json({
              error: true,
                message: "An error occured",
            });
        }

    }

    /**
     * Delete a wallet with id.
     * DELETE wallets/:id
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     */
    //async destroy({ params, request, response }) {}
}

module.exports = WalletController
