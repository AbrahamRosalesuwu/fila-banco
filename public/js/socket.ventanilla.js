var socket = io();

var searchParams = new URLSearchParams(window.location.search);
if(!searchParams.has('ventanilla')){
    window.location = 'index.html';
    throw new Error('Es necesaria la ventanilla');
}
var ventanilla = searchParams.get('ventanilla');
var label = $('small');
console.log(ventanilla);

// Inyecta los parámetros en un elemento html
$('h1').text('Ventanilla '+ventanilla);

$('button').on('click', function(){
    socket.emit('atenderTicket', {ventanilla: ventanilla}, function(resp){
        if(resp === 'No hay tickets'){
            label.text('Ya no hay tickets');
            alert(resp);
            return;
        }
        label.text('ticket número '+ resp.numero);
    });
});