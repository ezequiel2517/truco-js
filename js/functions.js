const {DateTime} = luxon;

//Lanzar carta al hacer click en la carta de la mano
async function lanzarCarta({ id: carta }) {
    interfaz.deshabilitarTablero();
    interfaz.deshabilitarCartas();
    manoJugador.jugarCarta(carta, "Jugador");
    juego.pasarTurno();
    if (manoCPU.cartasJugadas() !== 3) {
        if (manoCPU.cartasJugadas() < manoJugador.cartasJugadas()) {
            let res = await juego.duelo(await cpu.responderCarta(carta), carta);
            if (res.ganador === "CPU" && !res.fin) {
                (manoCPU.cartasJugadas() !== 3) && await cpu.jugarCarta();
            }
            if (!res.fin) {
                await new Promise(r => setTimeout(r, 1000));
                juego.pasarTurno();
                await interfaz.mensaje("TE TOCA");
                interfaz.habilitarBack();
            }
        }
        else if (manoCPU.cartasJugadas() === manoJugador.cartasJugadas()) {
            let res = await juego.duelo(manoCPU.getUltimaCartaJugada(), manoJugador.getUltimaCartaJugada());
            if (!res.fin) {
                (res.ganador === "CPU") && await cpu.jugarCarta();
                await new Promise(r => setTimeout(r, 1000));
                juego.pasarTurno();
                await interfaz.mensaje("TE TOCA");
                interfaz.habilitarBack();
            }
        }
    }
    else {
        await juego.duelo(manoCPU.getUltimaCartaJugada(), carta)
    }
    interfaz.habilitarCartas();
    interfaz.habilitarTablero();
}

//Cantar Truco al hacer click en la opción
async function cantarTruco({ innerHTML: canto }) {
    interfaz.deshabilitarCartas();
    interfaz.deshabilitarTablero();
    await interfaz.dialogue(canto, "Jugador");
    interfaz.deshabilitarRespuesta("Truco");
    manoCPU.moverTruco(canto);
    let puntos = 0;
    switch (canto) {
        case "TRUCO":
            juego.setTurnoCanto("Jugador");
            puntos = 1;
            break;
        case "RETRUCO":
            puntos = 2;
            break;
        case "VALE 4":
            puntos = 3;
            break;
        default:
            break;
    }
    juego.pasarTurno();
    juego.moverCantoTruco();
    let respuesta = await cpu.cantarTruco();
    juego.pasarTurno();
    await interfaz.dialogue(respuesta, "CPU");
    switch (respuesta) {
        case "QUIERO":
            juego.setPuntosTruco(puntos++);
            break;
        case "NO QUIERO":
            juego.anotarPunto("Jugador", puntos);
            juego.reset();
            break;
        default:
            manoJugador.moverTruco(respuesta);
            interfaz.habilitarRespuesta("Truco", manoJugador.getCantoTruco());
            await cpu.esperarTruco();
            break;
    }
    await cpu.setRespuestaTruco();
    interfaz.habilitarCartas();
}

//Cantar Envido al hacer click en la opción
async function cantarEnvido({ innerText: canto }) {
    interfaz.deshabilitarButton("Envido");
    let cantoEnvido = canto.split("(")[0].trim();
    juego.setEnvido(cantoEnvido);
    await interfaz.dialogue(cantoEnvido, "Jugador");
    let respuesta = await cpu.cantarEnvido(cantoEnvido);
    await interfaz.dialogue(respuesta, "CPU");
    if (respuesta.search("QUIERO") === -1) {
        interfaz.habilitarRespuesta("Envido", respuesta);
    }
    else if (respuesta === "QUIERO") {
        await interfaz.dialogue("Tengo " + manoJugador.getEnvido(), "Jugador");
        await interfaz.dialogue("Tengo " + manoCPU.getEnvido(), "CPU");
        let puntos = juego.calcularPuntosEnvido();
        (manoJugador.getEnvido() > manoCPU.getEnvido()) ? juego.anotarPunto("Jugador", puntos) : juego.anotarPunto("CPU", puntos);
    }
    else {
        let puntos = juego.calcularPuntosEnvido();
        juego.anotarPunto("Jugador", puntos);
        interfaz.deshabilitarRespuesta("Envido");
    }
    juego.setCantoEnvido();
    await cpu.setRespuestaEnvido();
}


//Cantar Flor al hacer click en la opción
async function cantarFlor() {
    await interfaz.dialogue("FLOR", "Jugador");
    juego.anotarPunto("Jugador", 3);
    juego.setFlor();
    interfaz.deshabilitarRespuesta("Envido");
    interfaz.deshabilitarButton("Flor")
    cpu.setRespuestaEnvido();
}

//Cantar Quiero y resolver Envido o Truco
async function quiero({ parentElement: { id: opcion } }) {
    await interfaz.dialogue("QUIERO", "Jugador")
    let opcionEspera = opcion;
    switch (opcion) {
        case "Truco":
            switch (manoCPU.getCantoTruco()) {
                case "TRUCO":
                    juego.setPuntosTruco(2);
                    break;
                case "RETRUCO":
                    juego.setPuntosTruco(3);
                    break;
                case "VALE 4":
                    juego.setPuntosTruco(4);
                    break;
                default:
                    break;
            }
            break;
        case "Envido":
            await interfaz.dialogue("Tengo " + manoJugador.getEnvido(), "Jugador");
            await interfaz.dialogue("Tengo " + manoCPU.getEnvido(), "CPU");
            let puntos = juego.calcularPuntosEnvido();
            (manoJugador.getEnvido() > manoCPU.getEnvido()) ? juego.anotarPunto("Jugador", puntos) : juego.anotarPunto("CPU", puntos);
            break;
        default:
            break;
    }
    interfaz.deshabilitarRespuesta(opcion);
    (opcionEspera === "Truco") ? await cpu.setRespuestaTruco() : await cpu.setRespuestaEnvido();
}

//Cantar No Quiero y resolver Envido o Truco
async function noQuiero({parentElement: canto}) {
    await interfaz.dialogue("NO QUIERO", "Jugador");
    interfaz.deshabilitarRespuesta(canto.id);
    if (canto.id === "Truco") {
        switch (canto.firstElementChild.innerText) {
            case "RETRUCO":
                juego.anotarPunto("CPU", 1);
                break;
            case "VALE 4":
                juego.anotarPunto("CPU", 2);
                break;
            case "QUIERO":
                juego.anotarPunto("CPU", 3);
                break;
            default:
                break;
        }
        juego.reset("CPU");
    }
    else if (canto.id === "Envido") {
        juego.setEnvido("NO QUIERO");
        let puntos = juego.calcularPuntosEnvido();
        juego.anotarPunto("CPU", puntos);
        cpu.setRespuestaEnvido();
    }
}

//Guardar la partida en curso
function guardarPartida() {
    let hora = luxon.DateTime.now().toLocaleString(DateTime.DATETIME_SHORT)
    const oponente = interfaz.getOponente();
    const partida = { manoCPU, manoJugador, cpu, juego, hora, oponente };
    const partidas = JSON.parse(localStorage.getItem("partidas"));
    partidas.push(partida);
    localStorage.setItem("partidas", JSON.stringify(partidas));
}

//Cargar la partida seleccionada desde localStorage
function cargarPartida(p) {
    juego = new Juego();
    juego.cargarPartida(p.manoCPU, p.manoJugador, p.juego, p.oponente);
}

//Borrar la partida seleccionada desde localStorage
function borrarPartida(p) {
    let partidas = JSON.parse(localStorage.getItem("partidas"));
    const res = partidas.filter(e => e !== partidas[p]);
    localStorage.setItem("partidas", JSON.stringify(res));
}