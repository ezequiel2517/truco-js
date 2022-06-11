//Clase encargada de interactuar con HTML
class Interfaz {
    constructor() { };

    //Desabilitar botón de canto
    deshabilitarButton(opcion) {
        document.getElementById("button" + opcion).style.backgroundColor = "grey";
        document.getElementById("button" + opcion).removeAttribute("onclick");
    }

    //Habilitar botón de canto
    habilitarButton(opcion) {
        document.getElementById("button" + opcion).style.backgroundColor = "rgb(98, 108, 212)";
        document.getElementById("button" + opcion).setAttribute("onclick", "cantar" + opcion + "(this)")
    }

    //Habilitar tablero de cantos de respuesta
    habilitarRespuesta(respuesta) {
        //Si no hay respuesta -> Solo mostrar: Quiero - No Quiero
        if (respuesta === "") {
            document.getElementById("buttonRespuesta").style.display = "none"
        }
        document.getElementById("buttonRespuesta").innerHTML = respuesta;
        document.getElementById("tableroRespuesta").style.visibility = "visible";
        //Deshabilitar tablero de cantos
        const opciones = ["Truco", "Envido", "Flor"];
        for (let canto of opciones) {
            this.deshabilitarButton(canto);
        }
    }

    //Habilitar tablero de cantos de respuesta
    deshabilitarRespuesta() {
        document.getElementById("tableroRespuesta").style.visibility = "hidden";
        //Habilitar tablero de cantos
        const opciones = ["Truco", "Envido", "Flor"];
        for (let canto of opciones) {
            this.habilitarButton(canto);
        }
    }

    //Mostrar mensaje
    async mensaje(mensaje) {
        document.getElementById("mensaje").innerText = mensaje;
        //Mostrar animación de mensaje
        document.getElementById("mensaje").classList.add("mensajeAlerta");
        await new Promise(r => setTimeout(r, 700));
        document.getElementById("mensaje").classList.remove("mensajeAlerta");
    }

    //Deshabilitar click en cartas y cantos
    deshabilitarControl() {
        //Deshabilitar click en cartas
        for (let carta of document.getElementsByClassName("cartaJugador")) {
            carta.removeAttribute("onclick");
        }
        //Deshabilitar tablero de cantos
        const opciones = ["Truco", "Envido", "Flor"];
        for (let canto of opciones) {
            this.deshabilitarButton(canto);
        }
    }

    //Habilitar click en cartas y cantos
    habilitarControl() {
        for (let carta of document.getElementsByClassName("cartaJugador")) {
            carta.setAttribute("onclick", "lanzarCarta(this);")
        }
        //Habilitar tablero de cantos
        const opciones = ["Truco", "Envido", "Flor"];
        for (let canto of opciones) {
            this.habilitarButton(canto);
        }
    }

    //Anotar punto en tablero
    anotarPunto(jugador) {
        let ultimoPunto = Array.from(document.getElementsByClassName("punto" + jugador)).pop();
        if (ultimoPunto.style.borderLeft === "") {
            ultimoPunto.style.borderLeft = "3px solid #000";
        }
        else if (ultimoPunto.style.borderTop === "") {
            ultimoPunto.style.borderTop = "3px solid #000";
        }
        else if (ultimoPunto.style.borderRight === "") {
            ultimoPunto.style.borderRight = "3px solid #000";
        }
        else if (ultimoPunto.style.borderBottom === "") {
            ultimoPunto.style.borderBottom = "3px solid #000";
        }
        else if (!ultimoPunto.classList.contains("puntoFinal")) {
            ultimoPunto.classList.add("puntoFinal");
        }
        else {
            let punto = document.createElement("li");
            punto.classList.add("punto" + jugador);
            document.getElementById("partida" + jugador).appendChild(punto);
            ultimoPunto = Array.from(document.getElementsByClassName("punto" + jugador)).pop();
            ultimoPunto.style.borderLeft = "3px solid #000";
        }
    }

    //Reset de interfaz
    reset() {
        //Ocultar cartas en la mesa
        for (let carta of document.getElementsByClassName("cartaJugadorPlay")) {
            carta.style.visibility = "hidden";
        }
        for (let carta of document.getElementsByClassName("cartaCPUPlay")) {
            carta.style.visibility = "hidden";
        }
        //Resetear cartas en las manos
        for (let carta of document.getElementsByClassName("cartaJugador")) {
            carta.style.visibility = "visible";
            carta.removeAttribute("id");
        }
        for (let carta of document.getElementsByClassName("cartaCPU")) {
            carta.style.visibility = "visible";
            carta.style.backgroundPositionX = "-83.3px";
            carta.style.backgroundPositionY = "-510.8px";
        }
        //Cargar manos de jugadores
        this.cargarManoCPU(manoCPU.mostrarMano());
        this.cargarManoJugador(manoJugador.mostrarMano());
        // document.getElementById("buttonEnvido").innerText = "ENVIDO ("+manoJugador.envido+")";
    }

    //Setear id cartas y mostrar - Jugador
    cargarManoJugador(mano) {
        let i = 0;
        for (let carta of document.getElementsByClassName("cartaJugador")) {
            carta.setAttribute("id", mano[i])
            i++;
        }
        i = 0;
        for (let i = 0; i < 3; i++) {
            this.cargarCarta(mano[i]);
        }
    }

    //Setear id cartas - CPU
    cargarManoCPU(mano) {
        let i = 0;
        for (let carta of document.getElementsByClassName("cartaCPU")) {
            carta.setAttribute("id", mano[i])
            i++;
        }
    }

    //Mostrar carta
    cargarCarta(carta) {
        if (carta.includes("Basto")) {
            document.getElementById(carta).style.backgroundPositionY = -127.7 * 3 + "px";
        }
        else if (carta.includes("Oro")) {
            document.getElementById(carta).style.backgroundPositionY = -127.7 * 0 + "px";
        }
        else if (carta.includes("Espada")) {
            document.getElementById(carta).style.backgroundPositionY = -127.7 * 2 + "px";
        }
        else if (carta.includes("Copa")) {
            document.getElementById(carta).style.backgroundPositionY = -127.7 * 1 + "px";
        }
        document.getElementById(carta).style.backgroundPositionX = -83.3 * (carta.split(" ")[0] - 1) + "px";
    }

    //Mostrar carta en mesa y ocultar de mano
    jugarCarta(carta, jugador) {
        let posicionCarta = 0;
        let cartaJugador;
        if (jugador === "CPU") {
            cartaJugador = "cartaCPUPlay"
            posicionCarta = manoCPU.cartasJugadas() - 1;
        }
        else {
            cartaJugador = "cartaJugadorPlay"
            posicionCarta = manoJugador.cartasJugadas() - 1;
        }
        //Ocultar carta en mano
        document.getElementById(carta).style.visibility = "hidden";
        //Mostrar carta en mesa
        document.getElementsByClassName(cartaJugador)[posicionCarta].style.cssText = document.getElementById(carta).style.cssText;
        document.getElementsByClassName(cartaJugador)[posicionCarta].style.visibility = "visible";
    }
}

//Clase encargada de llevar las cartas del juego
class Baraja {
    constructor() {
        this.baraja = [];
        this.iniciarBaraja();
        this.barajar();
    }
    //Crear array de cartas
    iniciarBaraja() {
        this.baraja = [];
        const palos = ["Copa", "Basto", "Espada", "Oro"];
        const numeros = [1, 2, 3, 4, 5, 6, 7, 10, 11, 12];
        for (let i in numeros) {
            for (let j in palos) {
                this.baraja.push(numeros[i] + " de " + palos[j]);
            }
        }
    }

    //Mezclar array de cartas
    barajar() {
        let numCartas = this.baraja.length;
        for (let i = 0; i < numCartas; i++) {
            let j = Math.floor(Math.random() * numCartas);
            let temp = this.baraja[i];
            this.baraja[i] = this.baraja[j];
            this.baraja[j] = temp;
        }
    }

    //Pop a array de cartas (para repartir)
    dar() {
        return this.baraja.pop();
    }
}

//Clase encargada de llevar las cartas de los jugadores
class Mano {
    constructor(jugador) {
        this.jugador = jugador;
        this.mano = [];
        this.tomarMano();
        this.manoJugada = [];
        this.envido = juego.calcularEnvido(this.mano);
    }

    //Get  del número de cartas jugadas
    cartasJugadas() {
        return this.manoJugada.length;
    }

    //Repartir 3 cartas
    tomarMano() {
        for (let i = 0; i < 3; i++) {
            this.mano.push(barajaJuego.dar());
        }
    }

    //Get de mano
    mostrarMano() {
        return this.mano;
    }

    //Get a carta que se jugó en el lugar num
    getCartaJugada(num) {
        this.cartasJugadas[num - 1];
    }

    //Jugar carta
    jugarCarta(carta) {
        this.manoJugada.push(carta);
        this.mano = this.mano.filter(e => e !== carta);
        interfaz.jugarCarta(carta, this.jugador);
    }

    //Devueve el valor calculado del envido
    getEnvido() {
        return this.envido;
    }

    //Devuelve una carta random de la mano
    randomCarta() {
        return this.mano.pop();
    }

    getUltimaCartaJugada() {
        return this.manoJugada[this.manoJugada.length - 1];
    }
}

//Clase encargada de reglas de juego 
class Juego {
    constructor() {
        this.puntosTruco = 1;
        this.turno = this.jugadorInicia();
        this.partidaGral = [{ Jugador: "Jugador", Puntos: 0 }, { Jugador: "CPU", Puntos: 0 }];
        this.partida = [{ Jugador: "Jugador", Puntos: 0 }, { Jugador: "CPU", Puntos: 0 }];
        this.jerarquia =
            [
                { Num: 1, Palo: "Espada", Posc: 1 },
                { Num: 1, Palo: "Basto", Posc: 2 },
                { Num: 7, Palo: "Espada", Posc: 3 },
                { Num: 7, Palo: "Oro", Posc: 4 },
                { Num: 3, Palo: "Oro", Posc: 5 }, { Num: 3, Palo: "Espada", Posc: 5 }, { Num: 3, Palo: "Copa", Posc: 5 }, { Num: 3, Palo: "Basto", Posc: 5 },
                { Num: 2, Palo: "Oro", Posc: 6 }, { Num: 2, Palo: "Espada", Posc: 6 }, { Num: 2, Palo: "Copa", Posc: 6 }, { Num: 2, Palo: "Basto", Posc: 6 },
                { Num: 1, Palo: "Copa", Posc: 7 }, { Num: 1, Palo: "Oro", Posc: 7 },
                { Num: 12, Palo: "Oro", Posc: 8 }, { Num: 12, Palo: "Espada", Posc: 8 }, { Num: 12, Palo: "Copa", Posc: 8 }, { Num: 12, Palo: "Basto", Posc: 8 },
                { Num: 11, Palo: "Oro", Posc: 9 }, { Num: 11, Palo: "Espada", Posc: 9 }, { Num: 11, Palo: "Copa", Posc: 9 }, { Num: 11, Palo: "Basto", Posc: 9 },
                { Num: 10, Palo: "Oro", Posc: 10 }, { Num: 10, Palo: "Espada", Posc: 10 }, { Num: 10, Palo: "Copa", Posc: 10 }, { Num: 10, Palo: "Basto", Posc: 10 },
                { Num: 7, Palo: "Copa", Posc: 11 }, { Num: 7, Palo: "Basto", Posc: 11 },
                { Num: 6, Palo: "Oro", Posc: 12 }, { Num: 6, Palo: "Espada", Posc: 12 }, { Num: 6, Palo: "Copa", Posc: 12 }, { Num: 6, Palo: "Basto", Posc: 12 },
                { Num: 5, Palo: "Oro", Posc: 13 }, { Num: 5, Palo: "Espada", Posc: 13 }, { Num: 5, Palo: "Copa", Posc: 13 }, { Num: 5, Palo: "Basto", Posc: 13 },
                { Num: 4, Palo: "Oro", Posc: 14 }, { Num: 4, Palo: "Espada", Posc: 14 }, { Num: 4, Palo: "Copa", Posc: 14 }, { Num: 4, Palo: "Basto", Posc: 14 },
            ];
    }

    //Reset del juego
    reset(jugador) {
        barajaJuego = new Baraja();
        manoJugador = new Mano("Jugador");
        manoCPU = new Mano("CPU");
        interfaz.reset();
        this.partida[0].Puntos = 0;
        this.partida[1].Puntos = 0;
        this.puntosTruco = 1;
        this.turno = jugador;
        this.iniciarPartida();
    }

    //Setear puntos del truco
    puntosTruco(puntos) {
        this.puntosTruco = puntos;
    }

    //Pasar turno al otro jugador
    pasarTurno() {
        if (this.turno === "CPU") {
            this.turno = "Jugador";
        }
        else {
            this.turno = "CPU";
        }
    }

    //Get turno de jugador
    getTurno() {
        return this.turno;
    }

    //Get random a jugador que inicia
    jugadorInicia() {
        if (Math.floor(Math.random() * 2) == 1) {
            return "Jugador";
        }
        else {
            return "CPU";
        }
    }

    //Iniciar partida
    async iniciarPartida() {
        interfaz.deshabilitarControl();
        if (this.turno === "CPU") {
            await cpu.jugarCarta();
            juego.pasarTurno()
        }
        await interfaz.mensaje("TE TOCA");
        interfaz.habilitarControl();
    }

    //Anotar punto a jugador
    anotarPunto(jugador, puntos) {
        this.partidaGral.filter(e => e.Jugador === jugador)[0].Puntos += puntos;
        for (let i = 0; i < puntos; i++) {
            interfaz.anotarPunto(jugador);
        }
    }

    //Get a jerarquia de carta en el juego (Ej: 1 de Basto -> 2)
    jerarquiaCarta(carta) {
        return this.jerarquia.filter(e => e.Num + " de " + e.Palo === carta)[0].Posc;
    }

    //Return ganador y si es el fin de la partida
    async duelo(cartaCPU, cartaJugador) {
        let fin = false;
        let ganador;
        if (this.jerarquiaCarta(cartaJugador) < this.jerarquiaCarta(cartaCPU)) {
            this.partida.filter(e => e.Jugador === "Jugador")[0].Puntos++;
            ganador = "Jugador";
        }
        else {
            this.partida.filter(e => e.Jugador === "CPU")[0].Puntos++;
            ganador = "CPU";
        }
        if (this.partida.filter(e => e.Jugador === "Jugador")[0].Puntos == 2 ||
            this.partida.filter(e => e.Jugador === "CPU")[0].Puntos == 2) {
            if (this.partida.filter(e => e.Jugador === "Jugador")[0].Puntos == 2) {
                this.anotarPunto("Jugador", this.puntosTruco);
                this.turno = "Jugador";
            }
            else {
                this.anotarPunto("CPU", this.puntosTruco);
                this.turno = "CPU";
            }
            await new Promise(r => setTimeout(r, 2000));
            juego.reset(ganador);
            fin = true;
        }
        return { fin, ganador };
    }

    //Calcular envido de mano
    calcularEnvido(mano) {
        let cartasEnvido = [];
        let envido = 0;
        for (let i = 0; i < 3; i++) {
            cartasEnvido.push(this.jerarquia.filter(e => e.Num + " de " + e.Palo === mano[i]));
        }
        for (let j = 0; j < 3; j++) {
            for (let k = j + 1; k < 3; k++) {
                if (cartasEnvido[j][0].Num < 10 && cartasEnvido[k][0].Num < 10 && cartasEnvido[j][0].Palo === cartasEnvido[k][0].Palo) {
                    envido = 20 + cartasEnvido[j][0].Num + cartasEnvido[k][0].Num;
                    break
                }
                else if ((Math.min(cartasEnvido[j][0].Num, cartasEnvido[k][0].Num) < 10) && cartasEnvido[j][0].Palo === cartasEnvido[k][0].Palo) {
                    envido = 20 + Math.min(cartasEnvido[j][0].Num, cartasEnvido[k][0].Num);
                    break;
                }
                else if ((Math.min(cartasEnvido[j][0].Num, cartasEnvido[k][0].Num) >= 10) && cartasEnvido[j][0].Palo === cartasEnvido[k][0].Palo) {
                    envido = 20;
                    break;
                }
            }
            if (envido < cartasEnvido[j][0].Num && cartasEnvido[j][0].Num < 10)
                envido = cartasEnvido[j][0].Num;
        }
        return envido;
    }

    //Calcular flor para mano
    calcularFlor(mano) {
        let cartasFlor = [];
        let flor = 0;
        let val1 = 0;
        let val2 = 0;
        let val3 = 0;
        for (let i = 0; i < 3; i++) {
            cartasFlor.push(juego.jerarquia.filter(e => e.Num + " de " + e.Palo === mano[i]));
        }
        if (cartasFlor[0][0].Palo == cartasFlor[1][0].Palo && cartasFlor[1][0].Palo == cartasFlor[2][0].Palo) {
            if (cartasFlor[0][0].Num < 10)
                val1 = cartasFlor[0][0].Num;
            if (cartasFlor[1][0].Num < 10)
                val2 = cartasFlor[1][0].Num;
            if (cartasFlor[2][0].Num < 10)
                val3 = cartasFlor[2][0].Num;
            flor = 20 + val1 + val2 + val3;
        }
        return flor
    }
}

class CPU {
    constructor() { this.respuesta = false }

    //Esperar hasta que el usuario haga click
    async esperar() {
        return await new Promise(resolve => {
            const interval = setInterval(() => {
                let condition = this.respuesta;
                if (condition) {
                    clearInterval(interval);
                };
            }, 1000);
        });
    }

    //Evaluar/Cantar Envido
    async cantarEnvido() {
        let res = false;
        await new Promise(r => setTimeout(r, 2000));
        if (manoCPU.getEnvido() > 20) {
            res = true;
        }
        return res;
    }

    //Evaluar/Cantar Truco
    async cantarTruco(canto) {
        let jerarquia = 0;
        let res = "NO QUIERO";
        for (let carta of manoCPU.mostrarMano()) {
            jerarquia += juego.jerarquiaCarta(carta);
        }
        let jerarquiaMano = jerarquia / (3 - manoCPU.cartasJugadas());
        if (juego.getTurno() !== "Jugador" && jerarquiaMano <= 10) {
            switch (canto) {
                case "TRUCO":
                    await new Promise(r => setTimeout(r, 2000));
                    if (juego.getTurno() === "CPU" && jerarquiaMano <= 8) {
                        res = "RETRUCO";
                    }
                    else {
                        res = "QUIERO";
                    }
                    break;
                case "RETRUCO":
                    await new Promise(r => setTimeout(r, 2000));
                    if (juego.getTurno() === "CPU" && jerarquiaMano <= 6) {
                        res = "VALE 4";
                    }
                    else {
                        res = "QUIERO";
                    }
                    break;
                case "VALE 4":
                    await new Promise(r => setTimeout(r, 2000));
                    if (juego.getTurno() === "CPU" && jerarquiaMano <= 4) {
                        res = "QUIERO";
                    }
                    else {
                        res = "NO QUIERO";
                    }
                    break;
            }
        }
        return res;
    }

    //Responder según carta del oponente
    async responderCarta(cartaJugador) {
        let numCartas = 3 - manoCPU.cartasJugadas();
        let ganaCPU = false;
        let cartaCPU;
        const mano = manoCPU.mostrarMano();
        for (let i = 0; i < numCartas; i++) {
            if (juego.jerarquiaCarta(mano[i]) < juego.jerarquiaCarta(cartaJugador)) {
                cartaCPU = mano[i];
                ganaCPU = true;
                break;
            }
        }
        if (ganaCPU === true) {
            await new Promise(r => setTimeout(r, 2000));
            interfaz.cargarCarta(cartaCPU);
            manoCPU.jugarCarta(cartaCPU, "CPU");
        }
        else {
            cartaCPU = await this.jugarCarta();
        }
        return cartaCPU;
    }

    //Jugar carta aleatorioa
    async jugarCarta() {
        await new Promise(r => setTimeout(r, 2000));
        let cartaCPU = manoCPU.randomCarta();
        interfaz.cargarCarta(cartaCPU);
        manoCPU.jugarCarta(cartaCPU, "CPU");
        return cartaCPU;
    }
}

//Lanzar carta al hacer click en button
async function lanzarCarta(carta) {
    interfaz.deshabilitarControl();
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
    interfaz.habilitarControl();
}

async function cantarTruco(truco) {
    interfaz.deshabilitarControl();
    await interfaz.mensaje(truco.innerText);
    juego.pasarTurno();
    let respuesta = await cpu.cantarTruco(truco.innerText);
    await interfaz.mensaje(respuesta);
    switch (respuesta) {
        case "RETRUCO":
            interfaz.habilitarRespuesta("VALE 4");
            break;
        case "VALE 4":
            interfaz.habilitarRespuesta("");
            break;
        case "NO QUIERO":
            juego.anotarPunto("Jugador", 1);
            break;
    }
}

async function cantarEnvido() {
    interfaz.deshabilitarButton("Envido");
    await interfaz.mensaje("ENVIDO");
    let respuesta = await cpu.respuestaEnvido();
    await interfaz.mensaje(respuesta);
    if (respuesta === "NO QUIERO") {
        juego.anotarPunto("Jugador");
    }
    else {
        await interfaz.mensaje(manoJugador.envido);
        if (manoJugador.envido > manoCPU.envido) {
            await interfaz.mensaje("SON BUENAS");
            for (let i = 0; i < 2; i++) {
                juego.anotarPunto("Jugador");
            }
        }
        else {
            for (let i = 0; i < 2; i++) {
                juego.anotarPunto("CPU");
            }
            await interfaz.mensaje(manoCPU.envido);
        }
    }
}

async function cantarFlor() {
    // await interfaz.mensaje("FLOR");
    manoJugador.flor = 1;
}

async function cantoRespuesta(canto) {
    await interfaz.mensaje(canto.innerText);
    if (canto.innerText === "VALE 4") {
        let respuesta = await cpu.cantarTruco(canto.innerText);
        await interfaz.mensaje(respuesta);
        if (respuesta === "NO QUIERO") {
            juego.anotarPunto("Jugador", 3)
            juego.reset();
        }
        else{
            juego.puntosTruco(4);
        }
    }
    interfaz.deshabilitarRespuesta();
}

function quiero() {
    cpu.respuesta = true;
}

const juego = new Juego();
const interfaz = new Interfaz();
let barajaJuego = new Baraja();
let manoJugador = new Mano("Jugador");
let manoCPU = new Mano("CPU");
const cpu = new CPU();
juego.reset(juego.jugadorInicia());
interfaz.deshabilitarControl();