'use strict'

//../app/Controllers/Http/AuthController.js

const User = use('App/Models/User');
// const Agent = use('App/Models/Agent');
const Agent = use('App/Models/Agent');
const Hash = use('Hash')
const Logger = use('Logger');
class AuthController {

  async login({
    request,
    auth,
    response
  }) {

    // console.log(request.post())
    //to login user send phone number and password, get user, with phone number and create a login with email

    let {
      email,
      password
    } = request.all();

    if (!email || !password) {
      return response.json({
        error: true,
        message: 'Data invalid, please resend!'
      })
    }
    try {
      if (await auth.attempt(email, password)) {
        let user = await User.findBy('email', email);
        let token = await auth.generate(user)
        var result = {
          error: false,
          user: user,
          token: token,
          message: "Login with success has user with email!"
        }
        // Object.assign(user, token)
        return response.json(result)
      }
    } catch (e) {
      console.log(e)
      return response.json({
        error: true,
        message: 'You are not registered!'
      })
    }
  };


  /**
   *
   * @param {request, auth, response} param0
   */
  async loginphone({
    request,
    auth,
    response
  }) {

    // console.log(request.post())

    let {
      phone,
      password
    } = request.all();

    try {
      let regex = new RegExp(/^((\+)[1-9]{2})[1-9](\d{2}){4}$/);
      let isPhoneNumber = regex.test(phone);
      console.log(!isPhoneNumber);

      if (!isPhoneNumber) {
        response.status(401).json({
          error: true,
          message: "The phone number is invalid!",
        });
      }

      Logger.info('Log user with phone : ' + phone + '  -------- ' + new Date());
      //Get user information using his phone
      let user = await User.findBy('phone', phone);
      if (user == null) {
        return response.status(403).json({
          error: true,
          message: 'You are not registered!'
        })
      }

      //extract user email
      const isSame = await Hash.verify(password, user.password);
      console.log("isSame");
      // console.log(isSame);

      //verify if, agent credentiel is correct and log him
      if (isSame) {
        //verify if, user credentiel is correct and log him
        let token = await auth.generate(user)
        var result = {
          error: false,
          user: user,
          token: token,
          message: "Login with success has user with phone!"
        }
        //Object.assign(user, token)
        return response.json(result)
      }
    } catch (e) {
      console.log(e)
      return response.json({
        error: true,
        message: 'You are not registered!'
      })
    }
  };

  /**
   *
   * @param {request, response} param0
   * password
   * username
   */
  async loginagent({

    request,
    auth,
    response
  }) {

    console.log('here------------------------')
    console.log(request.post())
    let {
      username,
      password
    } = request.all();

    try {
      let agent = await Agent.findBy('username', username);
      if (agent == null || !agent) {
        return response.status(403).json({
          error: true,
          message: 'You are not registered!'
        })
      }
      let token = await auth.generate(agent)
      return response.json({
        error: false,
        agent: agent,
        token: token,
        message: "Login with success has agent with  username!" + username,
      });
    } catch (e) {
      console.log(e)
      return response.json({
        error: true,
        message: 'You are not registered!'
      })
    }
  };

  async logout({
    request,
    auth,
    response
  }) {

    try {
      const token = auth.getAuthHeader();
      console.log(token)

      await auth.agent
        .tokens()
        .where('type', 'api_token')
        .where('is_revoked', false)
        .update({
          is_revoked: true
        });
      //console.log(t);
      await auth
        .authenticator('jwt')
        .revokeTokens([token], true)

      return response.json({
        error: false,
        message: 'Logout successfully',
      });
    } catch (e) {
      console.log(e)
      return response.json({
        error: true,
        message: 'We are not been able to logout, retry please!'
      });
    }
  };

}

module.exports = AuthController
