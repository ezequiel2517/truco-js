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

    jugarCarta(carta) {
        this.manoJugada.push(carta);
        this.mano = this.mano.filter(e => e !== carta);
    }

    getMano() {
        let manoRes = "";
        let numMano = this.mano.length;
        for (let i = 0; i < numMano; i++) {
            manoRes = manoRes + " | " + this.mano[i];
        }
        return manoRes;
    }

}

class Juego {
    constructor() {
        this.partida = [["Jugador", 0], ["CPU", 0]];
        this.jerarquia =
            [
                [1, "Espada", 1],
                [1, "Basto", 2],
                [7, "Espada", 3],
                [7, "Oro", 4],
                [3, "Oro", 5], [3, "Espada", 5], [3, "Copa", 5], [3, "Basto", 5],
                [2, "Oro", 6], [2, "Espada", 6], [2, "Copa", 6], [2, "Basto", 6],
                [1, "Copa", 7], [1, "Oro", 7],
                [12, "Oro", 8], [12, "Espada", 8], [12, "Copa", 8], [12, "Basto", 8],
                [11, "Oro", 9], [11, "Espada", 9], [11, "Copa", 9], [11, "Basto", 9],
                [10, "Oro", 10], [10, "Espada", 10], [10, "Copa", 10], [10, "Basto", 10],
                [7, "Copa", 11], [7, "Basto", 11],
                [6, "Oro", 12], [6, "Espada", 12], [6, "Copa", 12], [6, "Basto", 12],
                [5, "Oro", 13], [5, "Espada", 13], [5, "Copa", 13], [5, "Basto", 13],
                [4, "Oro", 14], [4, "Espada", 14], [4, "Copa", 14], [4, "Basto", 14],
            ];
    }

    jerarquiaCarta(carta) {
        return this.jerarquia.filter(e => e[0] + " de " + e[1] === carta)[0][2];
    }

    duelo(cartaCPU, cartaJugador) {
        let fin = false;
        let ganador;
        if (this.jerarquiaCarta(cartaJugador) < this.jerarquiaCarta(cartaCPU)) {
            alert("Mano para Jugador")
            this.partida[0][1]++;
            ganador = "Jugador";
        }
        else {
            alert("Mano para CPU")
            this.partida[1][1]++;
            ganador = "CPU";
        }
        if (this.partida[0][1] == 2) {
            alert("Gana Jugador: Jugador " + this.partida[0][1] + " - CPU " + this.partida[1][1])
            fin = true;
        }
        else if (this.partida[1][1] == 2) {
            alert("Gana CPU: CPU " + this.partida[1][1] + " - Jugador " + this.partida[0][1])
            fin = true;
        }
        return { fin, ganador };
    }

    jugadorInicia() {
        if (Math.floor(Math.random() * 2) == 1) {
            alert("Inicia Jugador");
            return "Jugador";
        }
        else {
            alert("Inicia CPU");
            return "CPU";
        }
    }

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
            flor = 20+val1+val2+val3      
        }
        return flor
    }
}

class CPU {
    constructor() { }

    responderCarta(cartaJugador) {
        let numCartas = manoCPU.mano.length;
        let ganaCPU = false;
        let cartaCPU = 4;
        for (let i = 0; i < numCartas; i++) {
            if (juego.jerarquiaCarta(manoCPU.mano[i]) < juego.jerarquiaCarta(manoJugador.manoJugada[cartaJugador])) {
                cartaCPU = manoCPU.mano[i];
                ganaCPU = true;
                break;
            }
        }
        if (ganaCPU === true) {
            manoCPU.jugarCarta(cartaCPU);
        }
        else if (ganaCPU === false) {
            cartaCPU = manoCPU.mano.pop();
            manoCPU.jugarCarta(cartaCPU);
        }
        return cartaCPU;
    }

    jugarCarta() {
        let cartaCPU = manoCPU.mano.pop();
        alert("CPU juega la carta: " + cartaCPU);
        manoCPU.jugarCarta(cartaCPU);
    }
}

const juego = new Juego();
const barajaJuego = new Baraja();
const manoJugador = new Mano();
const manoCPU = new Mano();
const cpu = new CPU();

// console.log(juego.calcularFlor(manoJugador));
// console.log(juego.calcularFlor(manoCPU));


// let res = { fin: false, ganador: juego.jugadorInicia() };

// for (let i = 0; i < 3 && res.fin === false; i++) {
//     if (res.ganador === "Jugador") {
//         manoJugador.jugarCarta(prompt("Tu mano es: " + manoJugador.getMano() + " ¿Que carta quieres jugar?"));
//         cpu.responderCarta(i);
//     }
//     else {
//         cpu.jugarCarta();
//         manoJugador.jugarCarta(prompt("Tu mano es: " + manoJugador.getMano() + " ¿Que carta quieres jugar?"));
//     }

//     res = juego.duelo(manoCPU.manoJugada[i], manoJugador.manoJugada[i]);
// }


function cargarMano(manoJugador, manoCPU){
    let i = 0;
    for (let carta of document.getElementsByClassName("cartaJugador") ){
        carta.setAttribute("id", manoJugador[i])
        i++;
    }
    i=0;
    for (let carta of document.getElementsByClassName("cartaCPU") ){
        carta.setAttribute("id", manoCPU[i])
        i++;
    }
}

function cargarCarta(mano){
    for(let i=0; i<3; i++){
        if (mano[i].includes("Basto"))
        {
            document.getElementById(mano[i]).style.backgroundPositionY = -127.7*3 + "px";
        }
        else if(mano[i].includes("Oro"))
        {
            document.getElementById(mano[i]).style.backgroundPositionY = -127.7*0 + "px";
        }
        else if(mano[i].includes("Espada"))
        {
            document.getElementById(mano[i]).style.backgroundPositionY = -127.7*2 + "px";
        }
        else if(mano[i].includes("Copa"))
        {
            document.getElementById(mano[i]).style.backgroundPositionY = -127.7*1 + "px";
        }
        document.getElementById(mano[i]).style.backgroundPositionX = -83.3*(mano[i].split(" ")[0]-1) + "px";
    } 
}
cargarMano(manoJugador.mano, manoCPU.mano);
cargarCarta(manoJugador.mano);
cargarCarta(manoCPU.mano);

function lanzarCarta(carta){
    if (manoJugador.mano.length==3){
        manoJugador.jugarCarta(carta.id);
        document.getElementsByClassName("cartaJugadorJugada")[0].style.cssText =carta.style.cssText ;
        document.getElementsByClassName("cartaJugadorJugada")[0].style.visibility="visible"
        carta.style.visibility="hidden"
        let cartaCPU = cpu.responderCarta(0);
        document.getElementsByClassName("cartaCPUJugada")[0].style.cssText = document.getElementById(cartaCPU).style.cssText;
        document.getElementById(cartaCPU).style.visibility="hidden"
        document.getElementsByClassName("cartaCPUJugada")[0].style.visibility="visible"
    }
    else if (manoJugador.mano.length==2){
        manoJugador.jugarCarta(carta.id);
        document.getElementsByClassName("cartaJugadorJugada")[1].style.cssText =carta.style.cssText ;
        document.getElementsByClassName("cartaJugadorJugada")[1].style.visibility="visible"
        carta.style.visibility="hidden"
        let cartaCPU = cpu.responderCarta(1);
        document.getElementsByClassName("cartaCPUJugada")[1].style.cssText = document.getElementById(cartaCPU).style.cssText;
        document.getElementById(cartaCPU).style.visibility="hidden"
        document.getElementsByClassName("cartaCPUJugada")[1].style.visibility="visible"
    }
    else{
        manoJugador.jugarCarta(carta.id);
        document.getElementsByClassName("cartaJugadorJugada")[2].style.cssText =carta.style.cssText ;
        document.getElementsByClassName("cartaJugadorJugada")[2].style.visibility="visible"
        carta.style.visibility="hidden"
        let cartaCPU = cpu.responderCarta(2);
        document.getElementsByClassName("cartaCPUJugada")[2].style.cssText = document.getElementById(cartaCPU).style.cssText;
        document.getElementById(cartaCPU).style.visibility="hidden"
        document.getElementsByClassName("cartaCPUJugada")[2].style.visibility="visible"
    }
}