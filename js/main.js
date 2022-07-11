let juego = new Juego();

async function cargarJerarquia() {
    const res = await fetch("js/jerarquia.json");
    juego.jerarquia = await res.json();
}
cargarJerarquia();

const interfaz = new Interfaz();
let barajaJuego = new Baraja();
let manoJugador = new Mano("Jugador");
let manoCPU = new Mano("CPU");
let cpu = new CPU();

// ajax({
//     url: 'https://randomuser.me/api/',
//     dataType: 'json',
//     success: function(data) {
//       console.log(data);
//     }
//   });