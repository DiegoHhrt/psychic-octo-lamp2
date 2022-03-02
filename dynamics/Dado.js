class Dado {
    constructor(x, y) {
        let spriteSheet = new Image();
        spriteSheet.src = '../statics/img/dado_sprite.png';

        this.sprite = spriteSheet;
        this.spritePos = [0, 0];
        this.x = x;
        this.y = y;
        this.tamano = 16;
        this.tirando = false;
        this.ultimaAnim = Date.now();
    }

    dibujar(ctx, factorJuan) {
        ctx.drawImage(
            this.sprite,
            this.tamano * this.spritePos[0],
            this.tamano * this.spritePos[1],
            this.tamano,
            this.tamano,
            this.x * factorJuan,
            this.y * factorJuan,
            factorJuan * this.tamano * 4,
            factorJuan * this.tamano * 4,
        );
    }

    animar() {
        if (!this.tirando) {
            return;
        }
        let ahora = Date.now();
        if (ahora - this.ultimaAnim >= 100) {
            this.mostrarCara(numeroAleatorio(5) + 1);
            this.ultimaAnim = ahora;
        }
    }

    actualizar(ctx, factor, factorJuan) {
        this.animar();
        this.dibujar(ctx, factor, factorJuan);
    }

    mostrarCara(n) {
        switch (n) {
            case 1:
                this.spritePos[0] = 2;
                this.spritePos[1] = 1;
                break;
            case 2:
                this.spritePos[0] = 1;
                this.spritePos[1] = 1;
                break;
            case 3:
                this.spritePos[0] = 0;
                this.spritePos[1] = 1;
                break;
            case 4:
                this.spritePos[0] = 2;
                this.spritePos[1] = 0;
                break;
            case 5:
                this.spritePos[0] = 1;
                this.spritePos[1] = 0;
                break;
            case 6:
                this.spritePos[0] = 0;
                this.spritePos[1] = 0;
                break;
        }
    }
}
