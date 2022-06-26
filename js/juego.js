//Clase encargada de las reglas de juego, llevar partida (iniciar, guardar y cargar) y decidir duelos entre jugadores 
class Juego {
    constructor() {
        this.flor = false;
        this.cantoEnvido = false;
        this.puntosTruco = 1;
        this.turnoTruco = "";
        this.partidaGral = [{ Jugador: "Jugador", Puntos: 0 }, { Jugador: "CPU", Puntos: 0 }];
        this.partida = [{ Jugador: "Jugador", Puntos: 0 }, { Jugador: "CPU", Puntos: 0 }];
        this.envido = [];
        this.turno = this.jugadorInicia();
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
        if (!localStorage.getItem("partidas"))
            localStorage.setItem("partidas", JSON.stringify([]));
    }

    //Reset del juego (se termina un duelo e inicia otro)
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

    //Cargar partida
    cargarPartida(mCPU, mJugador, pJuego) {
        barajaJuego = new Baraja();
        manoJugador = new Mano("Jugador");
        manoJugador.mano = mJugador.mano;
        manoJugador.cantoTruco = mJugador.cantoTruco;
        for (let c of mJugador.manoJugada) {
            manoJugador.mano.push(c);
        }

        manoCPU = new Mano("CPU");
        manoCPU.mano = mCPU.mano;
        for (let c of mCPU.manoJugada) {
            manoCPU.mano.push(c);
        }

        interfaz.reset();

        for (let c of mJugador.manoJugada) {
            manoJugador.jugarCarta(c);
        }
        for (let c of mCPU.manoJugada) {
            interfaz.cargarCarta(c);
            manoCPU.jugarCarta(c, "CPU");
        }

        cpu = new CPU();
        this.turnoTruco = pJuego.turnoTruco;
        this.partida[0].Puntos = pJuego.partida[0].Puntos;
        this.partida[1].Puntos = pJuego.partida[1].Puntos;
        this.puntosTruco = pJuego.puntosTruco;
        this.envido = pJuego.envido;
        this.turno = "Jugador";
        this.flor = pJuego.flor;
        this.cantoEnvido = pJuego.cantoEnvido;
        this.iniciarPartida();
        interfaz.limpiarTablero();
        this.anotarPunto("Jugador", pJuego.partidaGral[0].Puntos);
        this.anotarPunto("CPU", pJuego.partidaGral[1].Puntos)
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

    //Retorna bool para saber si se cantó envido
    getCantoEnvido() {
        return this.cantoEnvido;
    }

    //Calcula los puntos en juego del canto Envido
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

    //Agregar canto a array de cantos de Envido
    setEnvido(canto) {
        this.envido.push(canto);
    }

    //Recorre array de Envido y si hay repetidos devuelve true (para saber evitar cantos: ENVIDO -> ENVIDO -> ENVIDO)
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

    //Pasar canto del Truco al otro jugador (para evitar casos en que un jugador cante: TRUCO -> RETRUCO)
    pasarTurno() {
        if (this.turno === "CPU") {
            this.turno = "Jugador";
        }
        else {
            this.turno = "CPU";
        }
    }

    //Get del jugador que lleva el canto del Truco
    getTurnoCanto() {
        return this.turnoTruco;
    }

    //Set del jugador que lleva el canto del Truco
    setTurnoCanto(jugador) {
        return this.turnoTruco = jugador;
    }

    //Cambiar jugador que lleva la prioridad para cantar Truco
    moverCantoTruco() {
        if (this.turnoTruco === "Jugador") {
            this.turnoTruco = "CPU";
        }
        else {
            this.turnoTruco = "Jugador";
        }
    }

    //Get del jugador que lleva el canto del Truco
    getTurno() {
        return this.turno;
    }

    //Get random a jugador que inicia la partida
    jugadorInicia() {
        let res = "CPU";
        if (Math.floor(Math.random() * 2) == 1) {
            res = "Jugador";
        }
        return res
    }

    //Iniciar nueva partida
    async iniciarPartida() {
        interfaz.deshabilitarCartas();
        interfaz.deshabilitarTablero();
        if (this.turno === "CPU") {
            await cpu.jugarCarta();
            juego.pasarTurno()
        }
        await interfaz.mensaje("TE TOCA");
        interfaz.habilitarBack();
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

    //Return ganador y si es el fin de la mano (por ejemplo: gana CPU 2 a 0)
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

    //Calcular puntos del Envido para una mano
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

    //Calcular puntos de la Flor para una mano
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