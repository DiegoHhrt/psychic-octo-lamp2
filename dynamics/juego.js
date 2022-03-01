let juegoDiv;
let juegoCanvas;
let ctx;
let drawnFrames = 0;
let inicio;
let frame_previo = new Date();
let framerate = 0;
let fuente = new FontFace('fuente', 'url(./statics/fonts/I-pixel-u.ttf)')
let factor = 16;
let factorJuan = 0;
let virtualHeight = 480;
let virtualWidth = 672;

function cicloJuego() {
    ctx.beginPath();
    ctx.fillStyle = "#0096A7";
    ctx.fillRect(0, 0, juegoCanvas.width, juegoCanvas.height);
    ctx.closePath();

    mostrarFramerate();
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

function redimensionarCanvas() {
    juegoCanvas.height = juegoDiv.clientHeight;
    juegoCanvas.width = juegoDiv.clientWidth;
    factor = 32 * (juegoCanvas.width / virtualWidth);
    factorJuan = juegoCanvas.width / virtualWidth;
    console.log(factor);
}

function posicionMouse(evento) {
    let clientRect = juegoCanvas.getBoundingClientRect();
    return {
        x: (evento.clientX - clientRect.left) / factorJuan,
        y: (evento.clientY - clientRect.top) / factorJuan,
    }
}

window.addEventListener("resize", redimensionarCanvas);

document.addEventListener("DOMContentLoaded", () => {
    juegoDiv = document.getElementById("juego");
    juegoCanvas = document.getElementById("juego-canvas");
    ctx = juegoCanvas.getContext("2d");

    ctx.imageSmoothingEnabled = false;
    redimensionarCanvas();

    juegoCanvas.addEventListener("click", (evento) => {
        console.log(posicionMouse(evento));
    });

    inicio = new Date();
    cicloJuego();
});
