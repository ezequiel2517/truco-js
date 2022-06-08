class Interfaz {
    constructor() { };

    async mensaje(){
        document.getElementById("mensaje").classList.add("mensajeAlerta");
        await new Promise(r => setTimeout(r, 500));
        document.getElementById("mensaje").classList.remove("mensajeAlerta");
    }

    reset() {
        barajaJuego = new Baraja();
        manoJugador = new Mano();
        manoCPU = new Mano();

        for (let carta of document.getElementsByClassName("cartaJugadorPlay")) {
            carta.style.visibility="hidden";
        }

        for (let carta of document.getElementsByClassName("cartaCPUPlay")) {
            carta.style.visibility="hidden";
        }

        for (let carta of document.getElementsByClassName("cartaJugador")) {
            carta.style.visibility="visible";
            carta.removeAttribute("id");
        }

        for (let carta of document.getElementsByClassName("cartaCPU")) {
            carta.style.visibility="visible";
            carta.style.backgroundPositionX= "-83.3px";
            carta.style.backgroundPositionY ="-510.8px";
        }




        this.cargarMano(manoJugador.mano, manoCPU.mano);
        for (let i = 0; i < 3; i++) {
            this.cargarCarta(manoJugador.mano[i]);
        }
    }

    cargarMano(manoJugador, manoCPU) {
        let i = 0;
        for (let carta of document.getElementsByClassName("cartaJugador")) {
            carta.setAttribute("id", manoJugador[i])
            i++;
        }
        i = 0;

        for (let carta of document.getElementsByClassName("cartaCPU")) {
            carta.setAttribute("id", manoCPU[i])
            i++;
        }
    }

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

    jugarCarta(carta, jugador) {
        let posicionCarta = 0;
        if (jugador.includes("CPU")) {
            posicionCarta = manoCPU.manoJugada.length - 1;
        }
        else {
            posicionCarta = manoJugador.manoJugada.length - 1;
        }
        document.getElementsByClassName(jugador)[posicionCarta].style.cssText = document.getElementById(carta).style.cssText;
        document.getElementById(carta).style.visibility = "hidden";
        document.getElementsByClassName(jugador)[posicionCarta].style.visibility = "visible";
    }
}

class Baraja {
    constructor() {
        this.baraja = [];
        this.iniciarBaraja();
        this.barajar();
    }

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

    barajar() {
        let numCartas = this.baraja.length;
        for (let i = 0; i < numCartas; i++) {
            let j = Math.floor(Math.random() * numCartas);
            let temp = this.baraja[i];
            this.baraja[i] = this.baraja[j];
            this.baraja[j] = temp;
        }
    }

    dar() {
        return this.baraja.pop();
    }
}

class Mano {
    constructor() {
        this.mano = [];
        this.tomarMano();
        this.manoJugada = [];
    }

    tomarMano() {
        for (let i = 0; i < 3; i++) {
            this.mano.push(barajaJuego.dar());
        }
    }

    jugarCarta(carta, idcartaJugador) {
        this.manoJugada.push(carta);
        this.mano = this.mano.filter(e => e !== carta);
        interfaz.jugarCarta(carta, idcartaJugador);
    }
}

class Juego {
    constructor() {
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

    jerarquiaCarta(carta) {
        return this.jerarquia.filter(e => e.Num + " de " + e.Palo === carta)[0].Posc;
    }

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
            await new Promise(r => setTimeout(r, 2000));
            interfaz.reset();
            this.partida[0].Puntos=0;
            this.partida[1].Puntos=0;
            fin = true;
        }
        return { fin, ganador };
    }

    jugadorInicia() {
        if (Math.floor(Math.random() * 2) == 1) {
            return "Jugador";
        }
        else {
            return "CPU";
        }
    }

    //***CALCULO DE ENVIDO Y FLOR EN PRUEBA***
    /*
    calcularEnvido(mano) {
        let cartasEnvido = [];
        let envido = 0;
        for (let i = 0; i < 3; i++) {
            cartasEnvido.push(juego.jerarquia.filter(e => e[0] + " de " + e[1] === mano.mano[i]));
        }
        for (let j = 0; j < 3; j++) {
            for (let k = j + 1; k < 3; k++) {
                if (cartasEnvido[j][0][0] < 10 && cartasEnvido[k][0][0] < 10 && cartasEnvido[j][0][1] == cartasEnvido[k][0][1]) {
                    envido = 20 + cartasEnvido[j][0][0] + cartasEnvido[k][0][0];
                    break
                }
                else if ((Math.min(cartasEnvido[j][0][0], cartasEnvido[k][0][0]) < 10) && cartasEnvido[j][0][1] == cartasEnvido[k][0][1]) {
                    envido = 20 + Math.min(cartasEnvido[j][0][0], cartasEnvido[k][0][0]);
                    break;
                }
                else if ((Math.min(cartasEnvido[j][0][0], cartasEnvido[k][0][0]) >= 10) && cartasEnvido[j][0][1] == cartasEnvido[k][0][1]) {
                    envido = 20;
                    break;
                }
            }
            if (envido < cartasEnvido[j][0][0] && cartasEnvido[j][0][0] < 10)
                envido = cartasEnvido[j][0][0];
        }
        return envido;
    }

    calcularFlor(mano) {
        let cartasFlor = [];
        let flor = 0;
        let val1 = 0;
        let val2 = 0;
        let val3 = 0;
        for (let i = 0; i < 3; i++) {
            cartasFlor.push(juego.jerarquia.filter(e => e[0] + " de " + e[1] === mano.mano[i]));
        }
        if (cartasFlor[0][0][1] == cartasFlor[1][0][1] && cartasFlor[1][0][1] == cartasFlor[2][0][1]) {
            if (cartasFlor[0][0][0] < 10)
                val1 = cartasFlor[0][0][0]
            if (cartasFlor[1][0][0] < 10)
                val2 = cartasFlor[1][0][0]
            if (cartasFlor[2][0][0] < 10)
                val3 = cartasFlor[2][0][0]
            flor = 20 + val1 + val2 + val3
        }
        return flor
    }
    */
}

class CPU {
    constructor() { }

     async responderCarta(cartaJugador) {
        await new Promise(r => setTimeout(r, 2000));

        let numCartas = manoCPU.mano.length;
        let ganaCPU = false;
        let cartaCPU;
        for (let i = 0; i < numCartas; i++) {
            if (juego.jerarquiaCarta(manoCPU.mano[i]) < juego.jerarquiaCarta(cartaJugador)) {
                cartaCPU = manoCPU.mano[i];
                ganaCPU = true;
                break;
            }
        }
        if (ganaCPU === true) {
            interfaz.cargarCarta(cartaCPU);
            manoCPU.jugarCarta(cartaCPU, "cartaCPUPlay");
        }
        else {
            cartaCPU = manoCPU.mano.pop();
            interfaz.cargarCarta(cartaCPU);
            manoCPU.jugarCarta(cartaCPU, "cartaCPUPlay");
        }
        return cartaCPU;
    }

    jugarCarta() {
        let cartaCPU = manoCPU.mano.pop();
        interfaz.cargarCarta(cartaCPU);
        manoCPU.jugarCarta(cartaCPU, "cartaCPUPlay");
    }

}

const juego = new Juego();
let barajaJuego = new Baraja();
let manoJugador = new Mano();
let manoCPU = new Mano();
const interfaz = new Interfaz();
interfaz.reset();
const cpu = new CPU();

async function lanzarCarta(carta) {
    manoJugador.jugarCarta(carta.id, "cartaJugadorPlay");
    if (manoCPU.mano.length > 0) {
        if (manoCPU.manoJugada.length < manoJugador.manoJugada.length) {
            let res = await juego.duelo(await cpu.responderCarta(carta.id), carta.id);
            if (res.ganador === "CPU" && !res.fin) {
                if (manoCPU.mano.length > 0) {
                    cpu.jugarCarta();                
                }
            }
            if (!res.fin){
            await new Promise(r => setTimeout(r, 1000));
            await interfaz.mensaje();
            }
        }
        else if (manoCPU.manoJugada.length === manoJugador.manoJugada.length) {
            let res = await juego.duelo(manoCPU.manoJugada[manoCPU.manoJugada.length - 1], manoJugador.manoJugada[manoJugador.manoJugada.length - 1]);
            if (!res.fin){
                if (res.ganador == "CPU") {
                    cpu.jugarCarta();       
                }           
                await new Promise(r => setTimeout(r, 1000));
                await interfaz.mensaje();
            }
        }
    }
    else{
       await juego.duelo(manoCPU.manoJugada[2], carta.id)
    }
}


