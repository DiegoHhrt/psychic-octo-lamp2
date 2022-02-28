let octolamp = new Image();
octolamp.src = "./statics/img/octolamp.png";

function dibujarPantallaJugadores(ctx, factor) {
    let tamanoFuente = factor;

    ctx.beginPath();

    ctx.textAlign = "center";
    ctx.fillStyle = "#FFFFFF";
    ctx.font = `${tamanoFuente}px monospace`;
    ctx.fillText("Escoja el número de jugadores", factor * 10.5, factor * 3);

    ctx.drawImage(octolamp, 0, 0, octolamp.width, octolamp.height, factor, factor, factor * 10, factor * 10);

    ctx.fillStyle = "#FF0000";
    ctx.fillRect(factor * 2, factor * 5, factor * 4, factor * 4);
    ctx.fillRect(factor * 8.5, factor * 5, factor * 4, factor * 4);
    ctx.fillRect(factor * 15, factor * 5, factor * 4, factor * 4);

    ctx.fillStyle = "#FFFFFF";
    ctx.fillText("2", factor * 4, factor * 10);
    ctx.fillText("3", factor * 10.5, factor * 10);
    ctx.fillText("4", factor * 17, factor * 10);

    ctx.fillStyle = "#FF0000";
    ctx.fillRect(factor * 8.5, factor * 11, factor * 4, factor * 2);
    ctx.font = `${tamanoFuente / 1.5}px monospace`;
    ctx.fillStyle = "#FFFFFF";
    ctx.fillText("Continuar", factor * 10.5, factor * 12);
    ctx.closePath();
}
