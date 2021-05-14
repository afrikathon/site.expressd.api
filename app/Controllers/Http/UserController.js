'use strict'
const User = use('App/Models/User');
const Wallet = use('App/Models/Wallet');
const Logger = use('Logger');
const Hash = use('Hash');
// Bring in validator
// const { validate } = use('Validator')

class UserController {
    /**
     * Show a list of all users.
     * GET users
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     * @param {View} ctx.view
     */
    async index({ request, auth, response, view }) {
        try {
            const isauth = await auth.check()
            console.log(auth.check());

            if (isauth) {
                const users = await User.all();
                return response.json({
                    error: false,
                    message: "all users returned",
                    users: users
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
     * Create/save a new payement.
     * POST users
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     */
    async store({ request, response }) {

        // console.log(request.post())
        let users;
        let userlength;
        if (await User.count()) {
            users = await User.count('id')
            userlength = +(users[0]["count"]) + 1;
        } else {
            userlength = 1;
        }
        // console.log(userlength);
        // console.log(request.body)
        //user.name = request.input('name')
        if (!request.post()) {
          return response.status(401).json({
                error: true,
                message: "Data invalid",
            });
        }

        try {
            var { firstname, lastname, phone, code, username, email, password, isactive, longitude, latitude } = request.post();
            //Implementer le code de pays de l'utilisateur
            code = '000';
            const status = 10000;
            longitude == null ? longitude = 0 : longitude = longitude;
            latitude == null ? latitude = 0 : latitude = latitude;
            isactive == null ? isactive = 0 : isactive = isactive;
            var regexNumber = /((\+)[1-9]{2})[1-9](\d{2}){4}/;

            if (phone == null || !phone.match(regexNumber)) {
                return response.status(401).json({
                    error: true,
                    message: "The phone number is invalid it must follow the syntax +22544334233!",
                });
            }
            const UserPhoneExist = await User.findBy('phone', phone);
            if(UserPhoneExist && phone != null ){
                return response.status(409).json({
                  message: "The number is already took by another user",
                });
            }
            const UserNameExist= await User.findBy('username', username);
            console.log(UserNameExist);
            if(UserNameExist && username != null){
              return response.status(409).json({
                  message: "The username is already took by another user",
                });
            }
            const UserEmailExist= await User.findBy('email', email);
            if(UserEmailExist  && email != null){
                return response.status(409).json({
                  message: "The email is already took by another user",
                });
            }
            const user = await User.create({ user_id: userlength, firstname: firstname, lastname: lastname,code: code, phone: phone, username: username, email: email, password: password, isactive: isactive, status: status, longitude: longitude, latitude: latitude });
            Logger.info('Saved one user' + new Date());
            //Create user Wallet here
            function makeid(length) {
                var result = '';
                var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
                var charactersLength = characters.length;
                for (var i = 0; i < length; i++) {
                    result += characters.charAt(Math.floor(Math.random() * charactersLength));
                }
                return result;
            }
            var wallet_number = makeid(12);
            //Hash the secret and ask user to change (10 days max)
            // const secret = Hash.Hash('Glory');
            const secret = "Glory";
            var idString = user['_id'].toString();
            console.log(idString)
            const wallet = await Wallet.create({ user_id: userlength, usermongoid: idString, amount: 0, wallet_number: wallet_number, paypal: null, bank: null, user_mobile_account: user.phone, is_active: true, secret: secret });
            return response.status(200).json({
                error: false,
                message: "User & Wallet created",
                id: userlength,
                user: user,
                wallet: wallet
            });
        } catch (error) {
          return response.status(500).json({
                error: true,
                message: "An error occured",
            });
        }
    }

    /**
     * Display a single user.
     * GET users/:id
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     * @param {View} ctx.view
     */
    async show({ params, request, auth, response, view }) {
        try {
            const isauth = await auth.check()
            if (isauth) {
                const user_id = params.id;
                const user = await User.find(user_id);
                if (user) {
                    return response.status(200).json({
                        error: false,
                        message: "User got",
                        id: user.id,
                        user: user,
                    });
                } else {
                    return response.status(401).json({
                        error: true,
                        message: "This user don't exit!",
                    });
                }

            } else {
                return response.status(401).json({
                    error: true,
                    message: "Can't get user ! please send valid token",
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
     * Update payement details.
     * PUT or PATCH users/:id
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     */
    async update({ params, request, auth, response }) {
        // try {
            if(!params.id){
                return response.status(401).json({
                  error: true,
                  message: "id invalid",
              });
          }
            const id = params.id;

            if (!request.post()) {
              return response.status(401).json({
                  error: true,
                  message: "Data invalid",
              });
            }
            var { firstname, lastname, phone, username, email, password, isactive, longitude, latitude } = request.post();
            //check if email not took


            const user = await User.find(id);
            console.log(user)
            if(!user){
              return response.status(404).json({
                error: true,
                message: "Invalid Id",
                id: id,
            });
            }

            if(phone != user.phone){
              var regexNumber = /((\+)[1-9]{2})[1-9](\d{2}){4}/;
              if (phone != null && !phone.match(regexNumber)) {
                return response.status(401).json({
                      error: true,
                      message: "The phone number is invalid it must follow the syntax +22544334233!",
                  });
              }

              const UserPhoneExist= await User.findBy('phone', phone);
              if(UserPhoneExist && phone !== null){
                  return response.status(409).json({
                    error: true,
                    message: "The number is already took by another user",
                  });
              }
            }


            if(username != user.username && username !== null){
              const UserNameExist= await User.findBy('username', username);
              if(UserNameExist && username !== null){
                return response.status(409).json({
                  error: true,
                    message: "The username is already took by another user",
                  });
              }
            }
            if(email != user.email && email !== null){
              const UserEmailExist= await User.findBy('email', email);
              if(UserEmailExist && email !== null){
                  return response.status(409).json({
                    error: true,
                    message: "The email is already took by another user",
                  });
              }

            }


            user.firstname = firstname == null ? user.firstname : firstname;
            user.lastname = lastname == null ? user.lastname : lastname;
            user.phone = phone == null ? user.phone : phone;
            user.username = username == null ? user.username : username;
            user.email = email == null ? user.email : email;
            user.password = password == null ? user.password : password;
            user.isactive = isactive == null ? user.isactive : isactive;
            user.longitude = longitude == null ? user.longitude : longitude;
            user.latitude = latitude == null ? user.latitude : latitude;

            //Logger
            Logger.info('Updated one user' + new Date());

            //save new information
            const resp = await user.save()
            console.log('resp    ----' + resp);
            return response.status(200).json({
                error: false,
                message: "User updated",
                id: user.id,
                user: user,
            });
        // } catch (error) {
        //   return response.status(500).json({
        //       error: true,
        //         message: "An error occured",
        //     });
        // }
    }

    /**
     * Delete a payement with id.
     * DELETE users/:id
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     */
    async destroy({ params, request, auth, response }) {
        try {
            const isauth = await auth.check()
            if (isauth) {
                const user_id = params.id;
                const user = await User.find(user_id);
                if (user) {
                    await user.delete()
                        //delete user wallet && all his information
                    return response.status(200).json({
                        error: false,
                        message: "User deleted",
                        id: user.id,
                        user: user,
                    });
                } else {
                    return response.status(401).json({
                        error: true,
                        message: "this user don't exit!",
                    });
                }

            } else {
                return response.status(401).json({
                    error: true,
                    message: "Can't delete, retry! please send valid token",
                });
            }
        } catch (error) {
            return response.status(401).json({
                error: true,
                message: 'Missing or invalid jwt token'
            });
        }

    }
}

module.exports = UserController
