let ws = null

$(function() {
    // Only connect when username is available
    if (window.username) {
        startChat()
    }
})

function startChat() {
    ws = adonis.Ws().connect()

    ws.on('open', () => {
        $('.connection-status').addClass('connected')
        subscribeToChannel()
    })

    ws.on('error', () => {
        $('.connection-status').removeClass('connected')
    })
}


//Then, add the channel subscription method, binding listeners to handle messages

function subscribeToChannel() {
    const collector = ws.subscribe('collector')

    collector.on('error', () => {
        $('.connection-status').removeClass('connected');
    })

    collector.on('message', (message) => {
        $('.messages').append(`
      <div class="message"><h3> ${message.username} </h3> <p> ${message.body} </p> </div>
    `);
    })
}

//Finally, add the event handler to send a message when the Enter key is released:
$('#message').keyup(function(e) {
    if (e.which === 13) {
        e.preventDefault()

        const message = $(this).val()
        console.log(message, window.username)
        $(this).val('')
            //io.sockets.in('collector').emit('message', data); //send message to a specifique channel
        ws.getSubscription('collector').emit('message', {
            username: window.username,
            body: message
        })
        return
    }
})