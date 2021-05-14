'use strict'
const Agent = use('App/Models/Agent');
//const Agent = use('App/Models/User');
const Wallet = use('App/Models/Wallet');
const Logger = use('Logger');
const Hash = use('Hash');
    /** @typedef {import('@adonisjs/framework/src/Request')} Request */
    /** @typedef {import('@adonisjs/framework/src/Response')} Response */
    /** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with agents
 */
class AgentController {
    /**
     * Show a list of all agents.
     * GET agents
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     * @param {View} ctx.view
     */
    async index({
        request,
        auth,
        response,
        view
    }) {
        try {
            const isauth = await auth.check()
            console.log(auth.check());
            if (isauth) {
                const agents = await Agent.all();
                return response.json({
                    error: false,
                    message: "all agents returned",
                    agents: agents
                });
            } else {
              returnresponse.status(401).json({
                    error: true,
                    message: 'Invalid login, you must be login & send valid jwt token!'
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
     * Create/save a new agent.
     * POST agents
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     */

    async store({
        request,
        auth,
        response
    }) {
        try {

            const isauth = await auth.check()
            console.log(auth.check());

            if (isauth) {
                // console.log(request.post())
                let agents;
                let agentlength;

                if (await Agent.count()) {
                    agents = await Agent.count('id')
                    agentlength = +(agents[0]["count"]) + 1;
                } else {
                    agentlength = 1;
                }
                // console.log(agentlength);
                // console.log(request.body)
                //agent.name = request.input('name')
                if (!request.post()) {
                    return response.status(401).json({
                        error: true,
                        message: "Data invalid",
                    });
                }

                var {
                    firstname,
                    lastname,
                    phone,
                    username,
                    email,
                    password,
                    isactive,
                    longitude,
                    latitude
                } = request.post();
                const status = 23000;
                longitude == null ? longitude = 0 : longitude = longitude;
                latitude == null ? latitude = 0 : latitude = latitude;
                isactive == null ? isactive = 0 : isactive = isactive;
                var regexNumber = /((\+)[1-9]{2})[1-9](\d{2}){4}/;
                if (phone != null && !phone.match(regexNumber)) {
                  return response.status(401).json({
                        error: true,
                        message: "The phone number is invalid it must follow the syntax +22544334233!",
                    });
                }

                const AgentPhoneExist= await Agent.findBy('phone', phone);
                if(AgentPhoneExist && phone !==null){
                    return response.status(409).json({
                      error: true,
                      message: "The number is already took by another Agent",
                    });
                }
              }

              if(username != agent.username && username !== null ){
                const AgentNameExist= await Agent.findBy('username', username);
                if(AgentNameExist){
                  return response.status(409).json({
                    error: true,
                      message: "The username is already took by another Agent",
                    });
                }
              }
              if(email != agent.email && email !== null){
                const AgentEmailExist= await Agent.findBy('email', email);
                if(AgentEmailExist){
                    return response.status(409).json({
                      error: true,
                      message: "The email is already took by another Agent",
                    });
                }

                if (firstname == null || lastname == null) {
                    return response.status(422).json({
                        error: true,
                        message: "The firstname or/and lastname number, invalid!",
                    });
                }
                const agent = await Agent.create({
                    agent_id: agentlength,
                    firstname: firstname,
                    lastname: lastname,
                    phone: phone,
                    username: username,
                    email: email,
                    password: password,
                    isactive: isactive,
                    status: status,
                    longitude: longitude,
                    latitude: latitude
                });
                Logger.info('Saved one agent' + new Date());
                //Create agent Wallet here
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
                var idString = agent['_id'].toString();
                const wallet = await Wallet.create({
                    agent_id: agentlength,
                    agentmongoid: idString,
                    amount: 0,
                    wallet_number: wallet_number,
                    paypal: null,
                    bank: null,
                    user_mobile_account: agent.phone,
                    secret: secret,
                    is_active: true
                });
                return response.status(200).json({
                    error: false,
                    message: "Agent & Wallet created",
                    id: agentlength,
                    agent: agent,
                    wallet: wallet
                });

            } else {
                return response.status(401).json({
                    error: true,
                    message: 'Missing or d jwt token, you must be connected to save agent'
                });
            }
        } catch (error) {
            return response.status(500).json({
                message: "An error occured",
            });
        }

    }


    /**
     * Display a single agent.
     * GET agents/:id
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     * @param {View} ctx.view
     */
    async show({
        params,
        request,
        auth,
        response,
        view
    }) {
        try {
            const isauth = await auth.check()
            if (isauth) {
                const agent_id = params.id;
                const agent = await Agent.find(agent_id);
                if (agent) {
                    return response.status(200).json({
                        error: false,
                        message: "Agent got",
                        id: agent.id,
                        agent: agent,
                    });
                } else {
                    return response.status(401).json({
                        error: true,
                        message: "This agent don't exit!",
                    });
                }

            } else {
                return response.status(401).json({
                    error: true,
                    message: "Can't get agent ! please send valid token",
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
     * Update agent details.
     * PUT or PATCH agents/:id
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     */
    async update({
        params,
        request,
        auth,
        response
    }) {

        try {
            const isauth = await auth.check()
            console.log(auth.check());
            if (isauth) {
                const id = params.id;
                if (!request.post()) {
                    return response.status(401).json({
                        error: true,
                        message: "Data invalid",
                    });
                }
                var {
                    firstname,
                    lastname,
                    phone,
                    username,
                    email,
                    password,
                    isactive,
                    longitude,
                    latitude
                } = request.post();
                //check if email not took


                //update
                const agent = await Agent.find(params.id);
                if (!agent) {
                    return response.status(401).json({
                        error: true,
                        message: "Agent don't exist, retry!",
                    });
                }
                if(phone != agent.phone){
                  var regexNumber = /((\+)[1-9]{2})[1-9](\d{2}){4}/;
                  if (phone != null && !phone.match(regexNumber)) {
                    return response.status(401).json({
                          error: true,
                          message: "The phone number is invalid it must follow the syntax +22544334233!",
                      });
                  }
                  const AgentPhoneExist= await Agent.findBy('phone', phone);
                  if(AgentPhoneExist && phone !==null){
                      return response.status(409).json({
                        error: true,
                        message: "The number is already took by another Agent",
                      });
                  }
                }

                if(username != agent.username && username !== null ){
                  const AgentNameExist= await Agent.findBy('username', username);
                  if(AgentNameExist){
                    return response.status(409).json({
                      error: true,
                        message: "The username is already took by another Agent",
                      });
                  }
                }
                if(email != agent.email && email !== null){
                  const AgentEmailExist= await Agent.findBy('email', email);
                  if(AgentEmailExist){
                      return response.status(409).json({
                        error: true,
                        message: "The email is already took by another Agent",
                      });
                  }
                }

                //check if the email is not alredy taken by another and the username(generate the username or/and password)
                agent.firstname = firstname == null ? agent.firstname : firstname;
                agent.lastname = lastname == null ? agent.lastname : lastname;
                agent.phone = phone == null ? agent.phone : phone;
                agent.username = username == null ? agent.username : username;
                agent.email = email == null ? agent.email : email;
                agent.password = password == null ? agent.password : password;
                agent.isactive = isactive == null ? agent.isactive : isactive;
                agent.longitude = longitude == null ? agent.longitude : longitude;
                agent.latitude = latitude == null ? agent.latitude : latitude;

                //Logger
                Logger.info('Updated one agent' + new Date());

                //save new information
                const resp = await agent.save()
                console.log('resp    ----' + resp);
                return response.status(200).json({
                    error: false,
                    message: "Agent updated",
                    id: agent.id,
                    agent: agent,
                });
            } else {
                return response.status(401).json({
                    error: true,
                    message: 'Missing or d jwt token, you must be connected to save agent'
                });
            }

        } catch (error) {
            return response.status(500).json({
                message: "An error occured",
            });
        }
    }

    /**
     * Delete a agent with id.
     * DELETE agents/:id
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     */
    async destroy({ params, request, auth, response }) {
        try {
            const isauth = await auth.check()
            if (isauth) {
                const agent_id = params.id;
                const agent = await Agent.find(agent_id);
                if (agent) {
                    await agent.delete()
                        //delete agent wallet && all his information
                    return response.status(200).json({
                        error: false,
                        message: "Agent deleted",
                        id: agent.id,
                        agent: agent,
                    });
                } else {
                    return response.status(401).json({
                        error: true,
                        message: "this agent don't exit!",
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

module.exports = AgentController
