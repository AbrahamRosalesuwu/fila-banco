// CREAR TICKET
const fs = require("fs");

class Ticket {
  constructor(numero, ventanilla) {
    this.numero = numero;
    this.ventanilla = ventanilla;
  }
}

class TicketControl {
  constructor() {
    // CREAMOS LAS PROPIEDADES DEL TICKET
    this.ultimo = 0;
    this.hoy = new Date().getDate();
    // Tickets pendientes
    this.tickets = [];
    // Tickets atendidos
    this.ultimos4 = [];

    // Leer la información almacenada de los tickets
    let data = require("../data/data.json");
    // ESTO LLAMA LA FUNCION DE REINICIAR CONTEO
    if (data.hoy === this.hoy) {
      this.ultimo = data.ultimo;
      this.tickets = data.tickets;
      this.ultimos4 = data.ultimos4;
    } else {
      this.reiniciarConteo();
    }
  }

  // CREAMOS UNA FUNCION QUE INCREMENTE EL NUMERO DE TICKETS
  siguiente() {
    this.ultimo += 1;
    // Nuevo ticket
    let ticket = new Ticket(this.ultimo, null);
    // Agregarlo al arreglo de tickets
    this.tickets.push(ticket);
    this.grabarArchivo();
    return `Ticket ${this.ultimo}`;
  }

  // tOMA EL ULTIMO NUMERO Y RETORNARLO
  getUltimoTicket() {
    return `Ticket ${this.ultimo}`;
  }
  // TOMA LOS ULTIMOS CUATRO TICKETS Y LOS RETORNA
  getUltimos4() {
    return this.ultimos4;
  }
  //
  atenderTicket(ventanilla) {
    /* Revisa si no hay tickets pendientes, entonces atiende un ticket */
    if (this.tickets.length === 0) {
      return "No hay tickets";
    }
    //Obtiene el numero del primer ticket que tengamos pendiente
    let numeroTicket = this.tickets[0].numero;
    //Elimina el primer ticket que atendió
    this.tickets.shift();
    // Declara una instancia de un nuevo ticket
    let atenderTicket = new Ticket(numeroTicket, ventanilla);
    // Agregar los ultimos cuatro al inicio del array
    this.ultimos4.unshift(atenderTicket);
    // Borra el ultimo elemento
    if(this.ultimos4.length > 4){
      this.ultimos4.splice(-1,1);
    }
    console.log('ultimos cuatro');
    console.log(this.ultimos4);
    // Graba el ticket en la base de datos
    this.grabarArchivo();
    return atenderTicket;
  }

  reiniciarConteo() {
    /* REINICIAMOS EL NUMERO DE TICKETS CADA VEZ QUE EMPIEZE UN NUEVO DIA 
    Y LO GRABA EN LA BASE DE DATOS
    */
    this.ultimo = 0;
    // Limpia los tickets por atender
    this.tickets = [];
    this.ultimos4 = [];

    this.grabarArchivo();
  }

  grabarArchivo() {
    // Tenemos la información que tenemos que grabar
    let jsonData = {
      ultimo: this.ultimo,
      hoy: this.hoy,
      tickets: this.tickets,
      ultimos4: this.ultimos4
    };
    // Y la convertimos en json
    let jsonDataString = JSON.stringify(jsonData);
    // Por último, la inyectamos en el archivo json
    fs.writeFileSync("./server/data/data.json", jsonDataString);
  }
}

module.exports = {
  TicketControl,
};
