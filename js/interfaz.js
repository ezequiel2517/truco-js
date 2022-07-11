//Clase encargada de interactuar con el DOM
class Interfaz {
    constructor() {
        this.perfilOponente = {Foto: "", Nombre: ""};
        const opciones = document.querySelector(".menuOpciones").children;
        for (let opcion of opciones) {
            switch (opcion.innerText) {
                case "NUEVA PARTIDA":
                    opcion.addEventListener("click", async () => {
                        await this.cargarOponente();
                        document.querySelector(".menuPrincipal").style.visibility = "hidden";
                        this.limpiarTablero();
                        juego.reset(juego.jugadorInicia());
                    });
                    break;
                case "CONTINUAR":
                    opcion.addEventListener("click", () => {
                        document.querySelector(".menuPrincipal").style.visibility = "hidden";
                        document.querySelector(".partidas").style.visibility = "hidden";
                    });
                    opcion.style.display = "none";
                    break;
                case "GUARDAR PARTIDA":
                    opcion.addEventListener("click", () => { this.mostrarPartidas("GUARDAR"); })
                    opcion.style.display = "none";
                    break;
                case "CARGAR PARTIDA":
                    opcion.addEventListener("click", () => {
                        this.mostrarPartidas("CARGAR");
                    })
                    break;
                default:
                    break;
            }
        }
    };

    //Utilizar API RandomUser para generar oponente
    async cargarOponente(){
        const res = await fetch("https://randomuser.me/api/")
        const data = await res.json();
        const oponente = document.querySelector(".iconPlayer");
        oponente.src = data.results[0].picture.large;
        this.perfilOponente.Foto = data.results[0].picture.large;
        const nameOponente = document.querySelector("#namePlayer");
        nameOponente.innerText = data.results[0].name.first.toUpperCase();
        this.perfilOponente.Nombre = data.results[0].name.first.toUpperCase();
    }

    getOponente(){
        return this.perfilOponente;
    }

    cargarOponentePartida(foto, nombre){
        const oponente = document.querySelector(".iconPlayer");
        oponente.src = foto;
        const nameOponente = document.querySelector("#namePlayer");
        nameOponente.innerText = nombre;
    }

    //Habilitar el menu principal del juego
    mostrarMenu() {
        document.querySelector(".menuPrincipal").style.visibility = "visible";
        document.querySelector(".partidas").style.visibility = "hidden";
    }

    //Mostrar el menú de cargar/guardar partidas
    mostrarPartidas(opcion) {
        document.querySelector(".tituloPartida").innerText = `${opcion} PARTIDA`;
        document.querySelector(".partidas").style.visibility = "visible";
        document.querySelector(".menuPrincipal").style.visibility = "hidden";
        const back = document.querySelector(".backPartida");
        back.addEventListener("click", () => {
            interfaz.mostrarMenu();
        });
        const partidas = document.querySelector(".partida");
        while (partidas.firstChild) {
            partidas.removeChild(partidas.lastChild);
        }
        const partidasLocal = JSON.parse(localStorage.getItem("partidas"));
        if (partidasLocal) {
            for (let i = 0; i < partidasLocal.length; i++) {
                let p = partidasLocal[i];
                const partida = document.createElement("li");
                partida.id = `partida${i}`;
                partida.innerText = `Jugador: ${p.juego.partidaGral[0].Puntos} - ${p.oponente.Nombre}: ${p.juego.partidaGral[1].Puntos} | ${p.hora}`;
                if (opcion === "CARGAR") {
                    partida.addEventListener("click", (p) => {
                        this.mostrarPopupPartida(p.target.id);
                    });
                    partida.style.cursor = "pointer";
                }
                partidas.append(partida);
            }
        }
        if (opcion === "GUARDAR") {
            const opcionGuardarPartida = document.createElement("li");
            opcionGuardarPartida.innerText = "*GUARDAR PARTIDA*";
            opcionGuardarPartida.style.cursor = "pointer";
            opcionGuardarPartida.addEventListener("click", () => {
                guardarPartida();
                this.mostrarPartidas("GUARDAR");
            });
            partidas.append(opcionGuardarPartida);
        }
    }

    //Desabilitar botón de canto 
    deshabilitarButton(opcion) {
        let parent = document.querySelector(`#${opcion}`);
        let button = parent.firstElementChild;
        parent.style.backgroundColor = "gray";
        parent.style.cursor = "default";
        button.removeAttribute("onclick");
    }

    //Habilitar botón de canto
    habilitarButton(opcion, texto) {
        if (opcion === "Envido") {
            let parent = document.querySelector(`#${opcion}`);
            parent.style.cursor = "pointer";
            parent.style.backgroundColor = "rgb(98, 108, 212)";
            let button = parent.lastElementChild;
            button.innerText = texto;
            let opcionTablero = document.querySelector(`#${opcion}`);
            button.onclick = function () {
                (button.innerText.includes("+")) ?
                    button.innerText = button.innerText.replace("+", "-") : button.innerText = button.innerText.replace("-", "+");
                if (document.querySelector("#" + this.parentElement.id).firstElementChild.style.display !== "inline")
                    for (let b of document.querySelector("#" + this.parentElement.id).children) {
                        b.style.display = "inline";
                    }
                else {
                    let cantos = Array.from(document.querySelector("#" + this.parentElement.id).children);
                    for (let c = 0; c < cantos.length - 1; c++) {
                        cantos[c].style.display = "none";
                    }
                }
            };
            let buttone = document.createElement("li");
            buttone.innerHTML = "ENVIDO";
            buttone.style.display = "none";
            buttone.setAttribute("onclick", "cantar" + opcion + "(this)")
            opcionTablero.prepend(buttone);
            let buttonre = document.createElement("li");
            buttonre.innerHTML = "REAL ENVIDO";
            buttonre.style.display = "none";
            buttonre.setAttribute("onclick", "cantar" + opcion + "(this)")
            opcionTablero.prepend(buttonre);
            let buttonfe = document.createElement("li");
            buttonfe.innerHTML = "FALTA ENVIDO";
            buttonfe.style.display = "none";
            buttonfe.setAttribute("onclick", "cantar" + opcion + "(this)")
            opcionTablero.prepend(buttonfe);
        }
        else {
            let parent = document.querySelector(`#${opcion}`);
            parent.style.backgroundColor = "rgb(98, 108, 212)";
            parent.style.cursor = "pointer";
            let button = parent.lastElementChild;
            button.innerText = texto;
            button.setAttribute("onclick", "cantar" + opcion + "(this)");
        }
    }

    //Habilitar tablero de cantos de respuesta
    habilitarRespuesta(opcion, respuesta) {
        let parent = document.querySelector(`#${opcion}`);
        parent.style.backgroundColor = "rgb(98, 108, 212)";
        parent.style.cursor = "pointer";
        while (parent.childElementCount > 1) {
            parent.removeChild(parent.firstChild);
        }
        if (opcion === "Truco" && respuesta !== "") {
            let buttonRespuesta = parent.lastElementChild;
            buttonRespuesta.setAttribute("onclick", "cantarTruco(this);");
            buttonRespuesta.innerText = respuesta;
        }
        let opcionTablero = document.querySelector(`#${opcion}`);
        let noQuiero = document.createElement("li");
        noQuiero.innerHTML = "NO QUIERO";
        noQuiero.setAttribute("onclick", "noQuiero(this);")
        opcionTablero.prepend(noQuiero);

        let quiero = document.createElement("li");
        quiero.innerHTML = "QUIERO";
        quiero.setAttribute("onclick", "quiero(this);");
        opcionTablero.prepend(quiero);
        if (opcion === "Envido" && respuesta !== "") {
            let envido = document.querySelector("#Envido").lastElementChild;
            envido.innerText = "ENVIDO (" + manoJugador.getEnvido() + ")";
            let ordenEnvido = ["ENVIDO", "ENVIDO", "REAL ENVIDO", "FALTA ENVIDO"];
            juego.getEnvidoRepetido() && ordenEnvido.shift();
            let comienzo = ordenEnvido.indexOf(respuesta);
            for (let i = comienzo + 1; i < ordenEnvido.length; i++) {
                let buttonRespuesta = document.createElement("li");
                buttonRespuesta.innerHTML = ordenEnvido[i];
                buttonRespuesta.setAttribute("onclick", `cantar${opcion}(this);`);
                opcionTablero.prepend(buttonRespuesta);
            }
        }
    }

    //Habilitar tablero de cantos de respuesta
    deshabilitarRespuesta(opcion) {
        let tablero = document.querySelector(`#${opcion}`);
        while (tablero.childElementCount > 1) {
            tablero.removeChild(tablero.firstChild);
        }
        this.deshabilitarButton(`${opcion}`);
    }

    //Mostrar mensaje
    async mensaje(mensaje) {
        document.getElementById("mensaje").innerText = mensaje;
        document.getElementById("mensaje").classList.add("mensajeAlerta");
        await new Promise(r => setTimeout(r, 500));
        document.getElementById("mensaje").classList.remove("mensajeAlerta");
    }

    //Mostrar canto
    async dialogue(mensaje, jugador) {
        let posicionDialogue = (jugador === "Jugador") ? "360px" : "10px";
        document.getElementById("dialogue").style.top = posicionDialogue;
        document.getElementById("dialogueMensaje").innerText = mensaje;
        document.getElementById("dialogue").classList.add("dialogueAlerta");
        await new Promise(r => setTimeout(r, 500));
        document.getElementById("dialogue").classList.remove("dialogueAlerta");
        document.getElementById("dialogue").style.visibility = "visible";
        await new Promise(r => setTimeout(r, 300));
        document.getElementById("dialogue").style.visibility = "hidden";

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
        const back = document.querySelector(".backGame");
        back.style.visibility = "hidden";
    }

    //Habilitar click en cartas y cantos
    habilitarCartas() {
        for (let carta of document.getElementsByClassName("cartaJugador")) {
            carta.setAttribute("onclick", "lanzarCarta(this);")
        }
    }

    //Habilitar tablero de cantos
    habilitarTablero() {
        (manoJugador.cartasJugadas() === 0 && juego.getPuntosTruco() === 1 && !juego.getCantoEnvido())
            && this.habilitarButton("Envido", "ENVIDO (" + manoJugador.getEnvido() + ") +");
        (manoJugador.flor !== 0 && !juego.getFlor() && manoJugador.cartasJugadas() === 0)
            && this.habilitarButton("Flor", "FLOR (" + manoJugador.getFlor() + ")");
        ((juego.getTurnoCanto() === "Jugador" || juego.getTurnoCanto() === "") && manoJugador.getCantoTruco() !== "")
            && this.habilitarButton("Truco", manoJugador.getCantoTruco());
    }

    //Anotar punto en tablero
    anotarPunto(jugador) {
        let ultimoPunto = Array.from(document.getElementsByClassName("punto" + jugador)).pop();
        if (ultimoPunto.style.borderLeft === "") {
            ultimoPunto.style.borderLeft = "3px solid white";
        }
        else if (ultimoPunto.style.borderTop === "") {
            ultimoPunto.style.borderTop = "3px solid white";
        }
        else if (ultimoPunto.style.borderRight === "") {
            ultimoPunto.style.borderRight = "3px solid white";
        }
        else if (ultimoPunto.style.borderBottom === "") {
            ultimoPunto.style.borderBottom = "3px solid white";
        }
        else if (!ultimoPunto.classList.contains("puntoFinal")) {
            ultimoPunto.classList.add("puntoFinal");
        }
        else {
            let punto = document.createElement("li");
            punto.classList.add("punto" + jugador);
            document.getElementById("partida" + jugador).appendChild(punto);
            ultimoPunto = Array.from(document.getElementsByClassName("punto" + jugador)).pop();
            ultimoPunto.style.borderLeft = "3px solid white";
        }
    }

    //Reset de interfaz
    reset() {
        this.deshabilitarRespuesta("Envido");
        this.deshabilitarRespuesta("Truco");
        for (let carta of document.getElementsByClassName("cartaJugadorPlay")) {
            carta.style.visibility = "hidden";
        }
        for (let carta of document.getElementsByClassName("cartaCPUPlay")) {
            carta.style.visibility = "hidden";
        }
        for (let carta of document.getElementsByClassName("cartaJugador")) {
            carta.style.visibility = "visible";
            carta.removeAttribute("id");
        }
        for (let carta of document.getElementsByClassName("cartaCPU")) {
            carta.style.visibility = "visible";
            carta.style.backgroundPositionX = "-83.3px";
            carta.style.backgroundPositionY = "-510.8px";
        }
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

    //Buscar la carta en el tablero y la carga
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
        document.getElementById(carta).style.visibility = "hidden";
        document.getElementsByClassName(cartaJugador)[posicionCarta].style.cssText = document.getElementById(carta).style.cssText;
        document.getElementsByClassName(cartaJugador)[posicionCarta].style.visibility = "visible";
    }

    //Borrar puntos del tablero
    limpiarTablero() {
        const puntosCPU = document.querySelector("#partidaCPU");
        while (puntosCPU.childElementCount > 0) {
            puntosCPU.removeChild(puntosCPU.lastElementChild);
        }
        const puntosJugador = document.querySelector("#partidaJugador");
        while (puntosJugador.childElementCount > 0) {
            puntosJugador.removeChild(puntosJugador.lastElementChild);
        }
        const puntoJugadorNew = document.createElement("li");
        puntoJugadorNew.classList.add("puntoJugador");
        puntosJugador.appendChild(puntoJugadorNew);
        const puntoCPUNew = document.createElement("li");
        puntoCPUNew.classList.add("puntoCPU");
        puntosCPU.appendChild(puntoCPUNew);
    }

    //Habilitar el button para regresar al menú
    habilitarBack() {
        const back = document.querySelector(".backGame");
        back.style.visibility = "visible";
        back.addEventListener("click", () => {
            interfaz.mostrarMenu();
            const opciones = document.querySelector(".menuOpciones").children;
            for (let opcion of opciones) {
                if (opcion.style.display === "none")
                    opcion.style.display = "inline-block";
            }
        });
    }

    //Cargar datos de la partida en el popup y mostrar
    mostrarPopupPartida(p) {
        let iPartida = Number(p.replace(/[^0-9]/g, ''));
        const partida = JSON.parse(localStorage.getItem("partidas"))[iPartida];
        const popupMensaje = document.querySelector("#popupPartidaMensaje");
        const popup = document.querySelector("#popupPartida");
        const titulo = document.querySelector("#tituloPartida");
        titulo.innerText = `Jugador: ${partida.juego.partidaGral[0].Puntos} - ${partida.oponente.Nombre}: ${partida.juego.partidaGral[1].Puntos} | ${partida.hora}`;
        popupMensaje.addEventListener("click", (e) => {
            e.stopPropagation();
        })
        popup.addEventListener("click", () => {
            popup.style.visibility = "hidden";
            popupMensaje.style.visibility = "hidden";
        })
        const opciones = document.querySelector("#opcionesPopup");
        while (opciones.firstChild) {
            opciones.removeChild(opciones.lastChild);
        }
        const borrar = document.createElement("button");
        borrar.innerText = "BORRAR";
        const cargar = document.createElement("button");
        cargar.innerText = "CARGAR";
        cargar.addEventListener("click", () => {
            cargarPartida(partida);
            popup.style.visibility = "hidden";
            popupMensaje.style.visibility = "hidden";
            document.querySelector(".menuPrincipal").style.visibility = "hidden";
            document.querySelector(".partidas").style.visibility = "hidden";
        })
        borrar.addEventListener("click", () => {
            borrarPartida(iPartida);
            popup.style.visibility = "hidden";
            popupMensaje.style.visibility = "hidden";
            interfaz.mostrarPartidas("CARGAR");
        })
        opciones.append(cargar);
        opciones.append(borrar);
        popup.style.visibility = "visible";
        popupMensaje.style.visibility = "visible";
    }
}