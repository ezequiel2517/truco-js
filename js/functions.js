//Lanzar carta al hacer click en la carta de la mano
async function lanzarCarta(carta) {
    interfaz.deshabilitarTablero();
    interfaz.deshabilitarCartas();
    manoJugador.jugarCarta(carta.id, "Jugador");
    juego.pasarTurno();
    if (manoCPU.cartasJugadas() !== 3) {
        if (manoCPU.cartasJugadas() < manoJugador.cartasJugadas()) {
            let res = await juego.duelo(await cpu.responderCarta(carta.id), carta.id);
            if (res.ganador === "CPU" && !res.fin) {
                if (manoCPU.cartasJugadas() !== 3) {
                    await cpu.jugarCarta();
                }
            }
            if (!res.fin) {
                await new Promise(r => setTimeout(r, 1000));
                juego.pasarTurno();
                await interfaz.mensaje("TE TOCA");
            }
        }
        else if (manoCPU.cartasJugadas() === manoJugador.cartasJugadas()) {
            let res = await juego.duelo(manoCPU.getUltimaCartaJugada(), manoJugador.getUltimaCartaJugada());
            if (!res.fin) {
                if (res.ganador == "CPU") {
                    await cpu.jugarCarta();
                }
                await new Promise(r => setTimeout(r, 1000));
                juego.pasarTurno();
                await interfaz.mensaje("TE TOCA");
            }
        }
    }
    else {
        await juego.duelo(manoCPU.getUltimaCartaJugada(), carta.id)
    }
    interfaz.habilitarCartas();
    interfaz.habilitarTablero();
}

//Cantar Truco al hacer click en la opción
async function cantarTruco(truco) {
    interfaz.deshabilitarCartas();
    interfaz.deshabilitarTablero();
    let canto = truco.innerHTML;
    await interfaz.dialogue(canto, "Jugador");
    interfaz.deshabilitarRespuesta("Truco");
    manoCPU.moverTruco(canto);
    let puntos = 0;
    switch (truco.innerText) {
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
            juego.setPuntosTruco(puntos + 1);
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
async function cantarEnvido(canto) {
    interfaz.deshabilitarButton("Envido");
    let cantoEnvido = canto.innerText.split("(")[0].trim();
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
        if (manoJugador.getEnvido() > manoCPU.getEnvido())
            juego.anotarPunto("Jugador", puntos);
        else
            juego.anotarPunto("CPU", puntos);
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
async function quiero(opcion) {
    await interfaz.dialogue("QUIERO", "Jugador")
    let opcionEspera = opcion.parentElement.id;
    switch (opcion.parentElement.id) {
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
            if (manoJugador.getEnvido() > manoCPU.getEnvido())
                juego.anotarPunto("Jugador", puntos);
            else
                juego.anotarPunto("CPU", puntos);
            break;
        default:
            break;
    }
    interfaz.deshabilitarRespuesta(opcion.parentElement.id);
    if (opcionEspera === "Truco")
        await cpu.setRespuestaTruco();
    else
        await cpu.setRespuestaEnvido();
}

//Cantar No Quiero y resolver Envido o Truco
async function noQuiero(opcion) {
    await interfaz.dialogue("NO QUIERO", "Jugador");
    const canto = opcion.parentElement;
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

function guardarPartida() {
    let hora = moment().format('YYYY-MM-DD h:mm:ss a');
    const partida = { manoCPU, manoJugador, cpu, juego, hora };
    let iter = Number(localStorage.getItem("iter"));
    if (iter) {
        localStorage.setItem("partida" + iter, JSON.stringify(partida));
        localStorage.setItem("iter", iter += 1);
    }
    else {
        localStorage.setItem("iter", 1);
        localStorage.setItem("partida" + iter, JSON.stringify(partida));
    }
}

async function cargarPartida(partida){
    juego = new Juego();
    const p = JSON.parse(localStorage.getItem(partida.target.id));
    juego.cargarPartida(p.manoCPU, p.manoJugador, p.juego);
}