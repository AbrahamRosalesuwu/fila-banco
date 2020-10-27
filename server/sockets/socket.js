const { io } = require("../server");
const { TicketControl } = require("../classes/ticket-control");

// DECLARAR UNA NUEVA INSTANCIA PARA UTILIZAR EL TICKETCONTROL
const ticketControl = new TicketControl();

io.on("connection", (client) => {
  client.on("siguienteTicket", (data, callback) => {
    let siguiente = ticketControl.siguiente();

    console.log(siguiente);
    callback(siguiente);
  });

  // Emitir un evento llamado estadoActual
  client.emit("estadoActual", {
    actual: ticketControl.getUltimoTicket(),
    ultimos4: ticketControl.getUltimos4()
  });

  client.on("atenderTicket", (data, callback) => {
    if (!data.ventanilla) {
      return callback({
        err: true,
        mensaje: "La ventanilla es necesaria",
      });
    }
    let atenderTicket = ticketControl.atenderTicket(data.ventanilla);
    callback(atenderTicket);
    // Actualizar o notificar cambios en los últimos cuatro tickets
    client.broadcast.emit('ultimos4', {
    // Emitir ultimos cuatro tickets
      ultimos4: ticketControl.getUltimos4()
    });
  });
});
