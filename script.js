//Clase encargada de interactuar con HTML
class Interfaz {
    constructor() { };

    //Desabilitar botón de canto
    deshabilitarButton(opcion) {
        let button = document.querySelector(`#${opcion}`).lastElementChild;
        button.style.backgroundColor = "gray";
        button.style.cursor = "default";
        button.removeAttribute("onclick");
    }

    //Habilitar botón de canto
    habilitarButton(opcion, texto) {
        let button = document.querySelector(`#${opcion}`).lastElementChild;
        button.style.backgroundColor = "rgb(98, 108, 212)";
        button.innerText = texto;
        button.style.cursor = "pointer";
        button.setAttribute("onclick", "cantar" + opcion + "(this)");

    }

    //Habilitar tablero de cantos de respuesta
    habilitarRespuesta(opcion, respuesta) {
        if (opcion === "Envido")
            interfaz.deshabilitarRespuesta("Envido");
        let opcionTablero = document.querySelector(`#${opcion}`);
        let noQuiero = document.createElement("button");
        noQuiero.innerHTML = "NO QUIERO";
        noQuiero.setAttribute("onclick", "noQuiero(this);")
        opcionTablero.prepend(noQuiero);

        let quiero = document.createElement("button");
        quiero.innerHTML = "QUIERO";
        quiero.setAttribute("onclick", "quiero(this);");
        opcionTablero.prepend(quiero);
        if (opcion === "Truco" && respuesta !== "") {
            let buttonRespuesta = document.createElement("button");
            buttonRespuesta.innerHTML = respuesta;
            buttonRespuesta.setAttribute("onclick", `cantar${opcion}(this);`);
            opcionTablero.prepend(buttonRespuesta);
        }
        else if (opcion === "Envido" && respuesta !== "") {
            let ordenEnvido = ["ENVIDO", "ENVIDO", "REAL ENVIDO", "FALTA ENVIDO"];
            if (juego.getEnvidoRepetido())
                ordenEnvido.shift();
            let comienzo = ordenEnvido.indexOf(respuesta);
            for (let i = comienzo + 1; i < ordenEnvido.length; i++) {
                let buttonRespuesta = document.createElement("button");
                buttonRespuesta.innerHTML = ordenEnvido[i];
                buttonRespuesta.setAttribute("onclick", `cantar${opcion}(this);`);
                opcionTablero.prepend(buttonRespuesta);
            }
        }
        this.deshabilitarButton(`${opcion}`);
    }

    //Habilitar tablero de cantos de respuesta
    deshabilitarRespuesta(opcion) {
        let tablero = document.querySelector(`#${opcion}`);
        while (tablero.childElementCount > 1) {
            tablero.removeChild(tablero.lastChild);
        }
        this.deshabilitarButton(`${opcion}`);
    }

    //Mostrar mensaje
    async mensaje(mensaje) {
        document.getElementById("mensaje").innerText = mensaje;
        //Mostrar animación de mensaje
        document.getElementById("mensaje").classList.add("mensajeAlerta");
        await new Promise(r => setTimeout(r, 500));
        document.getElementById("mensaje").classList.remove("mensajeAlerta");
    }

    //Deshabilitar click en cartas
    deshabilitarCartas() {
        //Deshabilitar click en cartas
        for (let carta of document.getElementsByClassName("cartaJugador")) {
            carta.removeAttribute("onclick");
        }
    }

    //Deshabilitar tablero de cantos
    deshabilitarTablero() {
        const opciones = ["Truco", "Envido", "Flor"];
        for (let canto of opciones) {
            this.deshabilitarButton(`${canto}`);
        }
    }


    //Habilitar click en cartas y cantos
    habilitarCartas() {
        for (let carta of document.getElementsByClassName("cartaJugador")) {
            carta.setAttribute("onclick", "lanzarCarta(this);")
        }
    }

    //Habilitar tablero de cantos
    habilitarTablero() {
        if (manoJugador.cartasJugadas() === 0 && juego.getPuntosTruco() === 1 && !juego.getCantoEnvido()) {
            this.habilitarButton("Envido", "ENVIDO (" + manoJugador.getEnvido() + ")");
            let opcionTablero = document.querySelector("#Envido");
            let b = document.createElement("button");
            b.innerHTML = "REAL ENVIDO";
            b.setAttribute("onclick", "cantarEnvido(this);");
            opcionTablero.prepend(b);
            b = document.createElement("button");
            b.innerHTML = "FALTA ENVIDO";
            b.setAttribute("onclick", "cantarEnvido(this);");
            opcionTablero.prepend(b);
        }
        if (manoJugador.flor !== 0 && !juego.getFlor())
            this.habilitarButton("Flor", "FLOR (" + juego.calcularFlor(manoJugador.mostrarMano()) + ")");
        if ((juego.getTurnoCanto() === "Jugador" || juego.getTurnoCanto() === "") && manoJugador.getCantoTruco() !== "")
            this.habilitarButton("Truco", manoJugador.getCantoTruco());
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

    getRespuesta() {
        return document.getElementById("buttonRespuesta").innerText;
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
        this.flor = juego.calcularFlor(this.mano);
        this.envido = juego.calcularEnvido(this.mano);
        this.cantoTruco = "TRUCO";
    }

    //Get del canto disponible para truco
    getCantoTruco() {
        return this.cantoTruco;
    }

    //Deshabilitar truco
    disableCantoTruco() {
        this.cantoTruco = "";
    }

    //Una vez que se canta truco -> siguiente canto disponible
    moverTruco(truco) {
        switch (truco) {
            case "TRUCO":
                this.cantoTruco = "RETRUCO";
                break;
            case "RETRUCO":
                this.cantoTruco = "VALE 4";
                break;
            case "VALE 4":
                this.cantoTruco = "";
                break;
            default:
                break;
        }
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
        this.flor = false;
        this.cantoEnvido = false;
        this.puntosTruco = 1;
        this.turnoTruco = "";
        this.turno = this.jugadorInicia();
        this.partidaGral = [{ Jugador: "Jugador", Puntos: 0 }, { Jugador: "CPU", Puntos: 0 }];
        this.partida = [{ Jugador: "Jugador", Puntos: 0 }, { Jugador: "CPU", Puntos: 0 }];
        this.envido = [];
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
        cpu = new CPU();
        this.turnoTruco = "";
        this.partida[0].Puntos = 0;
        this.partida[1].Puntos = 0;
        this.puntosTruco = 1;
        this.envido = [];
        this.turno = jugador;
        this.flor = false;
        this.cantoEnvido = false;
        this.iniciarPartida();
    }

    //Setea flor para no mostrarla en el tablero cuando se canta
    setFlor() {
        this.flor = true;
    }

    //Devuelve true si hay flor
    getFlor() {
        return this.flor;
    }

    //Marca para saber si se cantó envido
    setCantoEnvido() {
        this.cantoEnvido = true;
    }

    getCantoEnvido() {
        return this.cantoEnvido;
    }

    //Calcula puntos del envido
    calcularPuntosEnvido() {
        let res = 0;
        for (let i = 0; i < this.envido.length; i++) {
            if (this.envido[i + 1] !== "NO QUIERO") {
                switch (this.envido[i]) {
                    case "ENVIDO":
                        res += 2;
                        break;
                    case "REAL ENVIDO":
                        res += 3;
                        break;
                    case "FALTA ENVIDO":
                        if (this.getPuntosGanando() < 15)
                            res += 30;
                        else
                            res += (30 - this.getPuntosGanando());
                        break;
                    default:
                        break;
                }
            }
            else {
                res += 1;
            }
        }
        return res;
    }

    //Agregar canto a array de cantos de envido
    setEnvido(canto) {
        this.envido.push(canto);
    }

    //Recorre array de envidos y si hay repetidos devuelve true
    getEnvidoRepetido() {
        const res = {};
        this.envido.forEach(element => {
            res[element] = (res[element] || 0) + 1;
        });
        return res.ENVIDO === 2;
    }

    //Retorna el puntaje del jugador que va ganando
    getPuntosGanando() {
        let res = this.partidaGral[0].Puntos;
        if (this.partidaGral[1].Puntos > res)
            res = this.partidaGral[1].Puntos;
        return res;
    }

    //Retorna los puntos del truco en juego
    getPuntosTruco() {
        return this.puntosTruco;
    }

    //Setear puntos del truco
    setPuntosTruco(puntos) {
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

    //Get jugador que lleva el canto del truco
    getTurnoCanto() {
        return this.turnoTruco;
    }

    //Get jugador que lleva el canto del truco
    setTurnoCanto(jugador) {
        return this.turnoTruco = jugador;
    }

    //Cambiar jugador que lleva la prioridad para cantar truco
    moverCantoTruco() {
        if (this.turnoTruco === "Jugador") {
            this.turnoTruco = "CPU";
        }
        else {
            this.turnoTruco = "Jugador";
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
        return "Jugador";
    }

    //Iniciar partida
    async iniciarPartida() {
        interfaz.deshabilitarCartas();
        interfaz.deshabilitarTablero();
        if (this.turno === "CPU") {
            await cpu.jugarCarta();
            juego.pasarTurno()
        }
        await interfaz.mensaje("TE TOCA");
        interfaz.habilitarCartas();
        interfaz.habilitarTablero();
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
    constructor() {
        this.respuestaTruco = false;
        this.respuestaEnvido = false;
        this.respuestaFin = false;
    }

    //Esperar hasta que el usuario responda Truco
    async esperarTruco() {
        return await new Promise(resolve => {
            const interval = setInterval(() => {
                let condition = this.respuestaTruco;
                if (condition) {
                    resolve();
                    clearInterval(interval);
                };
            }, 500);
        });
    }

    //Esperar hasta que el usuario responda Envido
    async esperarEnvido() {
        return await new Promise(resolve => {
            const interval = setInterval(() => {
                let condition = this.respuestaEnvido;
                if (condition) {
                    resolve();
                    clearInterval(interval);
                };
            }, 500);
        });
    }

    //Setear respuesta para espera de Truco
    async setRespuestaTruco() {
        this.respuestaTruco = true;
        await new Promise(r => setTimeout(r, 600));
        this.respuestaTruco = false;
    }

    //Setear respuesta para espera de Envido
    async setRespuestaEnvido() {
        this.respuestaEnvido = true;
        await new Promise(r => setTimeout(r, 600));
        this.respuestaEnvido = false;
    }

    //Evaluar/Cantar Truco
    async cantarTruco() {
        let jerarquia = 0;
        let res = "NO QUIERO";
        for (let carta of manoCPU.mostrarMano()) {
            jerarquia += juego.jerarquiaCarta(carta);
        }
        let subir = false;
        if (Math.floor(Math.random() * 3) >= 1) {
            subir = true;
        }
        let jerarquiaMano = jerarquia / (3 - manoCPU.cartasJugadas());
        let miTurno = juego.getTurnoCanto();
        if ((miTurno === "CPU" || miTurno === "") && jerarquiaMano <= 15) {
            if (subir && manoCPU.getCantoTruco() !== "") {
                await new Promise(r => setTimeout(r, 2000));
                manoJugador.moverTruco(manoCPU.getCantoTruco());
                res = manoCPU.getCantoTruco();
                juego.moverCantoTruco();
            }
            else {
                switch (manoJugador.getCantoTruco() && manoJugador.cartasJugadas() > 0) {
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
                res = "QUIERO";
            }
        }
        return res;
    }

    //Evaluar/Cantar Envido
    async cantarEnvido(canto) {
        let res = "NO QUIERO";
        if (!juego.getFlor() && !juego.getCantoEnvido()) {
            let envido = manoCPU.getEnvido();
            let subir = false;
            if (Math.floor(Math.random() * 3) >= 1) {
                subir = true;
            }
            if (subir) {
                switch (canto) {
                    case "ENVIDO":
                        if (envido >= 27)
                            res = "FALTA ENVIDO";
                        else if (envido >= 24)
                            res = "REAL ENVIDO";
                        else if (envido >= 20 && !juego.getEnvidoRepetido()) {
                            res = "ENVIDO";
                        }
                        break;
                    case "REAL ENVIDO":
                        if (envido >= 24)
                            res = "FALTA ENVIDO";
                        break;
                    case "FALTA ENVIDO":
                        if (envido >= 27)
                            res = "QUIERO";
                        break;
                    default:
                        break;
                }
                juego.setCantoEnvido();
            }
            else {
                switch (canto) {
                    case "ENVIDO":
                        if (envido >= 20)
                            res = "QUIERO"
                        break;
                    case "REAL ENVIDO":
                        if (envido >= 24)
                            res = "QUIERO"
                        break;
                    case "FALTA ENVIDO":
                        if (envido >= 27)
                            res = "QUIERO";
                        break;
                    default:
                        break;
                }
            }
        }
        juego.setEnvido(res);
        return res;
    }

    //Responder según carta del oponente
    async responderCarta(cartaJugador) {
        if (manoCPU.cartasJugadas() === 0) {
            let cantoEnvido = await this.cantarEnvido("ENVIDO");
            if (cantoEnvido.search("QUIERO") === -1) {
                await interfaz.mensaje(cantoEnvido);
                interfaz.habilitarRespuesta("Envido", cantoEnvido);
                await this.esperarEnvido();
                if (this.respuestaFin === true) {
                    return;
                }
            }
        }
        let cantoTruco = await this.cantarTruco();
        if (cantoTruco.search("QUIERO") === -1) {
            await interfaz.mensaje(cantoTruco);
            manoJugador.moverTruco(cantoTruco);
            interfaz.habilitarRespuesta("Truco", manoJugador.getCantoTruco());
            juego.pasarTurno();
            await this.esperarTruco();
            if (this.respuestaFin === true) {
                return;
            }
        }
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

    //Jugar carta aleatoria
    async jugarCarta() {
        if (manoCPU.cartasJugadas() === 0) {
            let cantoEnvido = await this.cantarEnvido("ENVIDO");
            if (cantoEnvido.search("QUIERO") === -1) {
                await interfaz.mensaje(cantoEnvido);
                interfaz.habilitarRespuesta("Envido", cantoEnvido);
                interfaz.habilitarTablero();
                await this.esperarEnvido();
                if (this.respuestaFin === true) {
                    return;
                }
            }
        }
        let cantoTruco = await this.cantarTruco();
        if (cantoTruco.search("QUIERO") === -1) {
            await interfaz.mensaje(cantoTruco);
            manoCPU.moverTruco();
            interfaz.habilitarRespuesta("Truco", manoJugador.getCantoTruco());
            interfaz.habilitarTablero();
            juego.pasarTurno();
            await this.esperarTruco();
            if (this.respuestaFin === true) {
                return;
            }
        }
        await new Promise(r => setTimeout(r, 2000));
        let cartaCPU = manoCPU.randomCarta();
        interfaz.cargarCarta(cartaCPU);
        manoCPU.jugarCarta(cartaCPU, "CPU");
        return cartaCPU;
    }
}

//Lanzar carta al hacer click en button
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

async function cantarTruco(truco) {
    interfaz.deshabilitarCartas();
    interfaz.deshabilitarTablero();
    let canto = truco.innerHTML;
    await interfaz.mensaje(canto);
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
    await interfaz.mensaje(respuesta);
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

async function cantarEnvido(canto) {
    interfaz.deshabilitarButton("Envido");
    let cantoEnvido = canto.innerText.split("(")[0].trim();
    await interfaz.mensaje(cantoEnvido);
    juego.setEnvido(cantoEnvido);
    juego.setCantoEnvido();
    let respuesta = await cpu.cantarEnvido(cantoEnvido);
    await interfaz.mensaje(respuesta);
    if (respuesta.search("QUIERO") === -1) {
        interfaz.habilitarRespuesta("Envido", respuesta);
    }
    else if (respuesta === "QUIERO") {
        await interfaz.mensaje("Jugador :" + manoJugador.getEnvido());
        await interfaz.mensaje("CPU: " + manoCPU.getEnvido());
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
    await cpu.setRespuestaEnvido();
}

async function cantarFlor() {
    await interfaz.mensaje("FLOR");
    juego.anotarPunto("Jugador", 3);
    juego.setFlor();
    interfaz.deshabilitarRespuesta("Envido");
    interfaz.deshabilitarButton("Flor")
    cpu.setRespuestaEnvido();
}

async function quiero(opcion) {
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
            await interfaz.mensaje("Jugador :" + manoJugador.getEnvido());
            await interfaz.mensaje("CPU: " + manoCPU.getEnvido());
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

async function noQuiero(opcion) {
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

const juego = new Juego();
const interfaz = new Interfaz();
let barajaJuego = new Baraja();
let manoJugador = new Mano("Jugador");
let manoCPU = new Mano("CPU");
let cpu = new CPU();
juego.reset(juego.jugadorInicia());