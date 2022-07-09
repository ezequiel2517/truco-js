let juego = new Juego();
const interfaz = new Interfaz();
let barajaJuego = new Baraja();
let manoJugador = new Mano("Jugador");
let manoCPU = new Mano("CPU");
let cpu = new CPU();

// fetch('https://jsonplaceholder.typicode.com/posts', {
//         method: 'POST',
//         headers:  {
//             'Content-type': 'application/json; charset=UTF-8',
//         },
//         body: JSON.stringify({
//             title: 'Coderhouse',
//             body: 'Clase 15',
//             userId: 5,
//         })
//     })
//     .then((resp) => resp.json())
//     .then((data) => {
//         console.log(data)
//     })

fetch('js/jararquia.json')
    .then((resp) => resp.json())
    .then((data) => {
        console.log(data)
    })