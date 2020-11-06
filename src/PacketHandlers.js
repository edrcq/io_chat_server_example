const store = require('../store')

function createHandlers(io, socket_client) {

    const ChangePseudo = (data) => {
        const packet = {}
        if (!store.clientsByPseudo[data.pseudo]) {
            store.clients[socket_client.id] = data.pseudo
            store.clientsByPseudo[data.pseudo] = socket_client.id
            packet.logged = true
            packet.pseudo = data.pseudo
        }
        else {
            packet.error = {
                message: 'Pseudo already used'
            }
        }
        socket_client.emit('pseudo_logged', packet)
    }

    const SendMessage = (data) => {
        if (!store.clients[socket_client.id]) {
            return ;
        }
        const packet_msg = {
            message: data.message,
            date: +new Date(),
            client: socket_client.id,
            pseudo: store.clients[socket_client.id] // get pseudo from global store
        }
        io.emit('new_message', packet_msg)
        // socket_client.broadcast.emit('new_message', packet_msg)
    }

    const Disconnect = () => {
        const pseudo = store.clients[socket_client.id]
        delete store.clients[socket_client.id]
        delete store.clientsByPseudo[pseudo]
    }

    return {
        SendMessage,
        ChangePseudo,
        Disconnect,
    }
}

module.exports = createHandlers