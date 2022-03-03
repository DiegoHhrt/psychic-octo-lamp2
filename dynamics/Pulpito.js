class Pulpito {
    constructor(rutaSprites, x, y, nombre) {
        let spriteSheet = new Image();
        spriteSheet.src = rutaSprites;

        this.sprite = spriteSheet;
        this.spritePos = [0, 0];
        this.x = x;
        this.y = y;
        this.nombre = nombre;
        this.direccion = '';
        this.tamano = 16;
        this.velocidad = this.tamano * 4;
        this.ultimaAnim = Date.now();
        this.casilla = 0;
    }

    dibujar(ctx, factor) {
        ctx.drawImage(
            this.sprite,
            this.tamano * this.spritePos[0],
            this.tamano * this.spritePos[1],
            this.tamano,
            this.tamano,
            this.x * factor,
            this.y * factor,
            factor * this.tamano,
            factor * this.tamano,
        );
    }

    // Cambia la sección del sprite que se dibuja para dar efecto de animación
    animar() {
        let ahora = Date.now();
        if (ahora - this.ultimaAnim >= 125) {
            if (this.direccion === '') {
                this.spritePos[1] = 0;
                if (this.spritePos[0] === 0) {
                    this.spritePos[0] = 1;
                } else {
                    this.spritePos[0] = 0;
                }
            } else {
                this.spritePos[1] = 1;
                this.spritePos[0] =
                    (this.spritePos[0] + 1) % (this.sprite.width / this.tamano);
            }
            this.ultimaAnim = ahora;
        }
    }

    mover(framerate) {
        switch (this.direccion) {
            case 'arriba':
                this.y -= this.velocidad / framerate;
                break;
            case 'abajo':
                this.y += this.velocidad / framerate;
                break;
            case 'izquierda':
                this.x -= this.velocidad / framerate;
                break;
            case 'derecha':
                this.x += this.velocidad / framerate;
                break;
        }
    }

    actualizar(ctx, framerate, factor) {
        this.animar();
        this.mover(framerate);
        this.dibujar(ctx, factor);
    }

    distancia(x, y) {
        return Math.sqrt((this.x - x) ** 2 + (this.y - y) ** 2)
    }
}
