'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.on('/').render('welcome')
Route.on('/collector').render('collector')

Route.group(() => {

    //Authentication (****) --ok--
    Route.post('/login', "AuthController.login");
    Route.post('/login/phone', "AuthController.loginphone");
    Route.post('/login/agent', "AuthController.loginagent");
    Route.get('logout', 'AuthController.logout').middleware('auth')



    //User routes (****) --ok--
    Route.get('users', "UserController.index").middleware('auth');
    Route.post('user', 'UserController.store');
    Route.get('user/:id', "UserController.show").middleware('auth');
    Route.put('user/:id', 'UserController.update').middleware('auth');
    //Route.delete('user/:id', 'UserController.destroy').middleware('auth');


    //Agent routes (****) ------ Ajouter les informations de ses materiels de travails --ok--
    Route.get('agents', "AgentController.index").middleware('auth');
    Route.post('agent', 'AgentController.store').middleware('auth');
    Route.get('/agent/:id', "AgentController.show").middleware('auth');
    Route.put('/agent/:id', 'AgentController.update').middleware('auth');
    Route.delete('agent/:id', 'AgentController.destroy').middleware('auth'); //change this to block the account until 15days if user don't change is point of view delete the account

    //Wallet routes (**)--ok--
    Route.get('wallets', "WalletController.index").middleware('auth');
    Route.post('/wallet/getwallet', "WalletController.show").middleware('auth'); //to get user wallet send in post request user_id & secret key
    Route.put('/wallet', "WalletController.update").middleware('auth'); //send all in body, wallet_idn user_id params;

    //For all payement route (booking) (****) --ok--
    Route.get('/payements/book/:getter_id', "BookPayementController.index").middleware('auth'); //get all payement
    Route.get('bookpayements/book/:user_id', "BookPayementController.showuserallpayement").middleware('auth'); //get user all payement
    Route.get('bookpayements/book/:payement_id/:user_id', "BookPayementController.showuseronepayement").middleware('auth'); //get one payement of user
    Route.post('payement/book', "BookPayementController.store").middleware('auth'); //add one payement
    Route.get('payement/book/:id', "BookPayementController.show").middleware('auth'); //get one payement with payement id
    Route.put('payement/book/:id', "BookPayementController.update").middleware('auth'); //update one payement
    //Route.delete('payement/book/:id/:collector_id', "BookPayementController.delete").middleware('auth'); //delete one payement


    //For all booking route (****) --ok--
    Route.get('bookings/:collector_id', "BookingController.index").middleware('auth');
    Route.post('booking', "BookingController.store").middleware('auth');
    Route.get('booking/:id', "BookingController.show").middleware('auth');
    Route.put('booking/:id', "BookingController.update").middleware('auth');
    Route.delete('/booking/:id/:collector_id', "BookingController.destroy").middleware('auth');


    //For all payement route (collector, employees, admin) : All payement for entreprise workers ()
    Route.get('payements/emp/:comptable_id', "EmpPayement.index").middleware('auth');
    Route.post('payement/emp', "EmpPayement.store").middleware('auth');
    Route.get('payement/emp/:id', "EmpPayement.show").middleware('auth');
    Route.put('payement/emp/:id', "EmpPayement.update").middleware('auth');
    Route.delete('payement/emp/:id/:comptable_id', "EmpPayement.destroy").middleware('auth');

    //For all promocode route (to generate promocode, to reduce or pay-off) ()
    Route.get('promocode/:manager_id', "PromoCode.index").middleware('auth');
    Route.post('promocode', "PromoCode.store").middleware('auth');
    Route.get('promocode/:id/manager_id', "PromoCode.show").middleware('auth');
    Route.put('promocode/:id', "PromoCode.update").middleware('auth'); //manager_id
    Route.delete('promocode/:id/:collector_id', "PromoCode.destroy").middleware('auth');

    //For statistics route ()
    Route.get('stats', "PayementController.index");
    Route.get('unpayed', "PayementController.index");
    Route.get('payed', "PayementController.index");


    //Other

}).prefix('api');
