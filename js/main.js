// const juego = new Juego();
// const interfaz = new Interfaz();
// let barajaJuego = new Baraja();
// let manoJugador = new Mano("Jugador");
// let manoCPU = new Mano("CPU");
// let cpu = new CPU();
// juego.reset(juego.jugadorInicia());

// function ocultarMenu(){
//     document.querySelector(".menuPrincipal").style.visibility="hidden"
// }

const juego = new Juego();
const interfaz = new Interfaz();
let barajaJuego = new Baraja();
let manoJugador = new Mano("Jugador");
let manoCPU = new Mano("CPU");
let cpu = new CPU();

const backs = document.querySelectorAll(".back");

for (back of backs) {
    back.addEventListener("click", () => {
        interfaz.mostrarMenu();
        const opciones = document.querySelector(".menuOpciones").children;
        for (opcion of opciones) {
            if (opcion.style.display === "none")
                opcion.style.display = "inline-block";
        }
    });
}

const opciones = document.querySelector(".menuOpciones").children;

for (opcion of opciones) {
    switch (opcion.innerText) {
        case "NUEVA PARTIDA":
            opcion.addEventListener("click", () => {
                document.querySelector(".menuPrincipal").style.visibility = "hidden"
                juego.reset(juego.jugadorInicia());
            });
            break;
        case "CONTINUAR":
            opcion.addEventListener("click", () => {
                document.querySelector(".menuPrincipal").style.visibility = "hidden"
                document.querySelector(".partidas").style.visibility = "hidden"
            });
            opcion.style.display = "none";
            break;
        case "GUARDAR PARTIDA":
            opcion.addEventListener("click", () => { opcionGuardarPartida() })
            opcion.style.display = "none";
            break;
        case "CARGAR PARTIDA":
            opcion.addEventListener("click", () => { opcionCargarPartida() })
            break;
        default:
            break;
    }
}
