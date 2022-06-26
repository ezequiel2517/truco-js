//Clase encargada de llevar las cartas de los jugadores
class Mano {
    constructor(jugador) {
        this.jugador = jugador;
        this.mano = [];
        this.manoJugada = [];
        this.tomarMano();
        this.flor = juego.calcularFlor(this.mano);
        this.envido = juego.calcularEnvido(this.mano);
        this.cantoTruco = "TRUCO";
    }

    //Get del canto disponible para truco
    getCantoTruco() {
        return this.cantoTruco;
    }

    //Get de los puntos de la flor
    getFlor() {
        return this.flor;
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

    //Repartir 3 cartas para el jugador
    tomarMano() {
        for (let i = 0; i < 3; i++) {
            this.mano.push(barajaJuego.dar());
        }
    }

    //Get de la mano del jugador
    mostrarMano() {
        return this.mano;
    }

    //Get a carta que se jugó en el lugar n
    getCartaJugada(n) {
        this.cartasJugadas[n - 1];
    }

    //Jugar carta (mover de mano a manoJugada)
    jugarCarta(carta) {
        this.manoJugada.push(carta);
        this.mano = this.mano.filter(e => e !== carta);
        interfaz.jugarCarta(carta, this.jugador);
    }

    //Devueve los puntos del envido
    getEnvido() {
        return this.envido;
    }

    //Devuelve una carta random de la mano
    randomCarta() {
        return this.mano.pop();
    }

    //Devuelve la última carta jugada
    getUltimaCartaJugada() {
        return this.manoJugada[this.manoJugada.length - 1];
    }
}