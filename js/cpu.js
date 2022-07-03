//Clase encargada de llevar el juego de la CPU
class CPU {
    constructor() {
        this.respuestaTruco = false;
        this.respuestaEnvido = false;
        this.respuestaFin = false;
    }

    //Esperar hasta que el usuario responda al canto del Truco
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

    //Esperar hasta que el usuario responda al canto del Truco
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

    //Setear respuesta del jugador para espera de Truco
    async setRespuestaTruco() {
        this.respuestaTruco = true;
        await new Promise(r => setTimeout(r, 600));
        this.respuestaTruco = false;
    }

    //Setear respuesta del jugador para espera de Envido
    async setRespuestaEnvido() {
        this.respuestaEnvido = true;
        await new Promise(r => setTimeout(r, 600));
        this.respuestaEnvido = false;
    }

    //Lanzar/responder los cantos del Truco
    async cantarTruco() {
        let jerarquia = 0;
        let res = "NO QUIERO";
        for (let carta of manoCPU.mostrarMano()) {
            jerarquia += juego.jerarquiaCarta(carta);
        }
        let subir = (Math.floor(Math.random() * 3) >= 1) ? true : false;
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

    //Lanzar/responder los cantos del Envido
    async cantarEnvido(canto) {
        let res = "NO QUIERO";
        if (!juego.getFlor() && !juego.getCantoEnvido()) {
            let envido = manoCPU.getEnvido();
            let subir = (Math.floor(Math.random() * 3) >= 1) ? true : false;
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
                            res = envido >= 24 && "FALTA ENVIDO";
                        break;
                    case "FALTA ENVIDO":
                            res = envido >= 27 && "QUIERO";
                        break;
                    default:
                        break;
                }
            }
            else {
                switch (canto) {
                    case "ENVIDO":
                            res = envido >= 20 && "QUIERO";
                        break;
                    case "REAL ENVIDO":
                            res = envido >= 24 && "QUIERO";
                        break;
                    case "FALTA ENVIDO":
                            res = envido >= 27 && "QUIERO";
                        break;
                    default:
                        break;
                }
            }
        }
        res = (res!==false) ? res : "NO QUIERO";
        juego.setEnvido(res);
        return res;
    }

    //Responder según carta del oponente
    async responderCarta(cartaJugador) {
        if (manoCPU.cartasJugadas() === 0) {
            let cantoEnvido = await this.cantarEnvido("ENVIDO");
            if (cantoEnvido.search("QUIERO") === -1) {
                juego.setCantoEnvido();
                await interfaz.dialogue(cantoEnvido, "CPU");
                interfaz.habilitarRespuesta("Envido", cantoEnvido);
                await this.esperarEnvido();
                if (this.respuestaFin === true) {
                    return;
                }
            }
        }
        let cantoTruco = await this.cantarTruco();
        if (cantoTruco.search("QUIERO") === -1) {
            await interfaz.dialogue(cantoTruco, "CPU");
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

    //Jugar carta aleatoria (uando es el turno de la CPU)
    async jugarCarta() {
        if (manoCPU.cartasJugadas() === 0) {
            let cantoEnvido = await this.cantarEnvido("ENVIDO");
            if (cantoEnvido.search("QUIERO") === -1) {
                juego.setCantoEnvido();
                await interfaz.dialogue(cantoEnvido, "CPU");
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
            await interfaz.dialogue(cantoTruco, "CPU");
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