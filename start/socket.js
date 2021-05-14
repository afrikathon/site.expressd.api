'use strict'

/*
|--------------------------------------------------------------------------
| Websocket
|--------------------------------------------------------------------------
|
| This file is used to register websocket channels and start the Ws server.
| Learn more about same in the official documentation.
| https://adonisjs.com/docs/websocket
|
| For middleware, do check `wsKernel.js` file.
|
*/

const Ws = use('Ws')

//create the channel here
Ws.channel('channelname','ControllerName');



//collector channel
Ws.channel('collector','CollectorController');



//socket with auth middleware
Ws.channel('chat', 'ChatController').middleware('auth')


//chat channel
Ws.channel('chat', ({ socket }) => {
  console.log('user joined with %s socket id', socket.id)
})
