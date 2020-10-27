const {TicketControl} = '../../server/classes/ticket-control.js';

// Comando para establecer la conexión
var socket = io();

var label = $('#lblNuevoTicket');

socket.on('connect', function(){
    console.log('Conectado :D');
});

socket.on("disconnect", function () {
    console.log('se perdió la conexión D:');
});

socket.on('estadoActual', function(resp){
    console.log(resp);
    label.text(resp.actual);
})

$('button').on('click', function(){
    socket.emit('siguienteTicket', null, function(siguienteTicket){
        label.text(siguienteTicket);
    });
});