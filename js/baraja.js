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