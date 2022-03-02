const pasos21 = [
    'izquierda',
    'izquierda',
    'izquierda',
    'izquierda',
    'arriba',
    'arriba',
    'arriba',
    'arriba',
    'derecha',
    'derecha',
    'derecha',
    'derecha',
    'abajo',
    'abajo',
    'abajo',
    'izquierda',
    'izquierda',
    'izquierda',
    'arriba',
    'arriba',
    'derecha',
    'derecha',
]

const pasos42 = [
    'izquierda',
    'izquierda',
    'izquierda',
    'izquierda',
    'izquierda',
    'izquierda',
    'arriba',
    'arriba',
    'arriba',
    'arriba',
    'arriba',
    'arriba',
    'derecha',
    'derecha',
    'derecha',
    'derecha',
    'derecha',
    'derecha',
    'abajo',
    'abajo',
    'abajo',
    'abajo',
    'abajo',
    'izquierda',
    'izquierda',
    'izquierda',
    'izquierda',
    'izquierda',
    'arriba',
    'arriba',
    'arriba',
    'arriba',
    'derecha',
    'derecha',
    'derecha',
    'derecha',
    'abajo',
    'abajo',
    'abajo',
    'izquierda',
    'izquierda',
    'arriba',
]

const tablero = pasos42;

let juegoDiv;
let juegoCanvas;
let ctx;
let drawnFrames = 0;
let inicio;
let frame_previo = new Date();
let framerate = 0;
let fuente = new FontFace('fuente', 'url(../statics/fonts/I-pixel-u.ttf)');
let tamanoCasilla = 32;
let factorJuan = 0;
let virtualHeight = 480;
let virtualWidth = 672;
let pulpitos = [];

function cicloJuego() {
    ctx.beginPath();
    ctx.fillStyle = "#0096A7";
    ctx.fillRect(0, 0, juegoCanvas.width, juegoCanvas.height);
    ctx.mozImageSmoothingEnabled = false;
    ctx.webkitImageSmoothingEnabled = false;
    ctx.msImageSmoothingEnabled = false;
    ctx.imageSmoothingEnabled = false;

    ctx.closePath();

    mostrarFramerate();
    pulpitos.forEach(pulpito => {
        pulpito.actualizar(ctx, framerate, factorJuan);
    });

    requestAnimationFrame(cicloJuego);
}

function mostrarFramerate() {
    ctx.beginPath();
    ctx.textAlign = "center";
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "20px monospace";

    if (Date.now() - frame_previo >= 1000) {
        framerate = drawnFrames;
        frame_previo = Date.now();
        drawnFrames = 0;
    }

    ctx.fillText(`${framerate} fps`, 50, 50);
    ctx.closePath();
    drawnFrames++;
}

async function moverCasilla(pulpito, num_casillas) {
    let {x, y} = pulpito;
    let casilla_actual = pulpito.casilla;
    pulpito.casilla += num_casillas;
    while (casilla_actual < pulpito.casilla) {
        pulpito.direccion = tablero[casilla_actual];
        while (pulpito.distancia(x, y) < pulpito.tamano * 2 && pulpito.direccion != undefined) {
            await sleep(100 / (framerate * 2));
        }
        x = pulpito.x;
        y = pulpito.y;
        casilla_actual++;
    }
    pulpito.direccion = '';
    if (pulpito.casilla >= tablero.length) {
        pulpito.direccion = 'nadando';
    }
}

function posicionMouse(evento) {
    let clientRect = juegoCanvas.getBoundingClientRect();
    return {
        x: (evento.clientX - clientRect.left) / factorJuan,
        y: (evento.clientY - clientRect.top) / factorJuan,
    }
}

function redimensionarCanvas() {
    juegoCanvas.width = window.innerWidth;
    juegoCanvas.height = window.innerWidth * (virtualHeight / virtualWidth);

    if (juegoCanvas.height > window.innerHeight) {
        juegoCanvas.height = window.innerHeight;
        juegoCanvas.width = window.innerHeight * (virtualWidth / virtualHeight);
    }

    // document.body.style.paddingLeft = (window.innerHeight - juegoCanvas.width) / 2;
    factorJuan = juegoCanvas.width / virtualWidth;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

window.addEventListener("resize", redimensionarCanvas);

document.addEventListener("DOMContentLoaded", () => {
    juegoDiv = document.getElementById("juego");
    juegoCanvas = document.getElementById("juego-canvas");
    ctx = juegoCanvas.getContext("2d");

    redimensionarCanvas();

    juegoCanvas.addEventListener("click", (evento) => {
        console.log(posicionMouse(evento));
    });

    pulpitos.push(
        new Pulpito(
            '../statics/img/pulpito_sprite_sheet_p1.png',
            tamanoCasilla * 10,
            tamanoCasilla * 10
        )
    );

    pulpitos.push(
        new Pulpito(
            '../statics/img/pulpito_sprite_sheet_p2.png',
            tamanoCasilla * 11,
            tamanoCasilla * 11
        )
    );

    pulpitos.push(
        new Pulpito(
            '../statics/img/pulpito_sprite_sheet_p3.png',
            tamanoCasilla * 11,
            tamanoCasilla * 10
        )
    );

    pulpitos.push(
        new Pulpito(
            '../statics/img/pulpito_sprite_sheet_p4.png',
            tamanoCasilla * 10,
            tamanoCasilla * 11
        )
    );

    inicio = new Date();
    cicloJuego();
});
