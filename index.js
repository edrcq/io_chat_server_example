// Prepare to include the server code into our web_server
const express = require('express')
const http = require('http')
const cors = require('cors')
const app = express()
const server = http.createServer(app)

app.use(express.static('html'))
/* End setup webserver */

const createHandlers = require('./src/PacketHandlers')

const io = require('socket.io')(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
        // allowedHeaders: ["my-custom-header"],
        credentials: true
    }
})

const pseudos = []
const clients = {
    'client.id': 'pseudo'
}

let connected = 0

io.on('connection', function(socket_client) {
    console.log('Client connected', socket_client.id)

    const handlers = createHandlers(io, socket_client)

    socket_client.on('change_pseudo', handlers.ChangePseudo)
    socket_client.on('send_message', handlers.SendMessage)
    socket_client.on('disconnect', handlers.Disconnect)

})

const port = process.env.PORT || 5055

server.listen(port, () => {
    console.log('started')
})




