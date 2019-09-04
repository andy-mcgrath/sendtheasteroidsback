let {
    init,
    initKeys,
    keyPressed,
    GameLoop,
    Pool,
    Sprite
} = kontra;

let gameSetting = {
    playerScore: 0,
    maxPlasma: 150,
    plasmaBurnRate: 1,
    plasmaRefillRate: 0.5,
    playerFireRate: 0.1,
    plasmaTtl: 120,
    canvasHeight: 800,
    canvasWidth: 800
}

init();
initKeys();

let playerSprite

let asteroidArray = []
let plasmaArray = []
let spriteArray = []

for (let i = 0; i < 4; i++) {
    setTimeout(() => createAsteroid(), Math.random() * 3000)
}

function random(number) {
    return Math.round(Math.random() * number)
}

function createAsteroid() {
    let asteroid = Sprite({
        type: 'asteroid',
        alive: true,
        hit: false,
        x: random(gameSetting.canvasWidth),
        y: random(-30),
        anchor: {x: 0.5, y: 0.5},
        dx: (Math.random() * 3) - 1.5,
        dy: Math.random(),
        ddy: 0.005,
        radius: random(20) + 10,
        height: this.radius,
        width: this.radius,
        update() {
            this.advance()
            if ((this.x - this.radius - 1 < 0) || (this.x + this.radius + 1 > gameSetting.canvasWidth)) {
                this.alive = false
                if (this.hit) {
                    gameSetting.playerScore += Math.round(this.radius * 100)
                }
                setTimeout(() => createAsteroid(), Math.random() * 3000)
            }
            if (this.collidesWith(playerSprite)) {
                playerSprite.alive = false
            }
            if (this.y + this.radius >= gameSetting.canvasHeight) {
                playerSprite.alive = false
            }
        },
        render() {
          this.context.strokeStyle = 'white';
          this.context.beginPath();  // start drawing a shape
          this.context.arc(this.x, this.y, this.radius, 0, Math.PI*2);
          this.context.stroke();     // outline the circle
        }
    })
    asteroidArray.push(asteroid)
}

let plasma01 = document.getElementById('plasma01')
function createPlasma(x, y, size) {
    let plasma = Sprite({
        type: 'plasma',
        alive: true,
        x: x,
        y: y,
        anchor: {x: 0.5, y: 0.5},
        width: size,
        height: size,
        radius: size / 2,
        image: plasma01,
        ttl: gameSetting.plasmaTtl,
        update() {
            this.ttl -= 1
            if (this.ttl < 1) {
                this.alive = false
            }
            asteroidArray.map((asteroid) => {collide(asteroid, this)})
            // for (asteroid of asteroidArray) {
                // if (this.collidesWith(asteroid)) {
                //     gameSetting.playerScore += 10
                //     this.alive = false
                //     if (asteroid.dx > 0) asteroid.dx += asteroid.dy
                //     if (asteroid.dx < 0) asteroid.dx -= asteroid.dy
                //     asteroid.dy *= -0.5
                //     asteroid.hit = true
                // }
            // }
        }
    })
    plasmaArray.push(plasma)
}

let playerImg = document.getElementById('playerImg')
playerImg.onload = function() {
    playerSprite = Sprite({
        type: 'player',
        alive: true,
        x: gameSetting.canvasWidth / 2,
        y: gameSetting.canvasHeight / 2,
        anchor: {x: 0.5, y: 0.5},
        dx: 0,
        dy: 0,
        dt: 0,
        width: 24,
        height: 32,
        radius: 16,
        plasma: gameSetting.maxPlasma,
        image: playerImg,
        update() {
            if (keyPressed('left')) {
                this.dx -= 0.05
            }
            if (keyPressed('right')) {
                this.dx += 0.05
            }
            if (keyPressed('up')) {
                this.dy -= 0.05
            }
            if (keyPressed('down')) {
                this.dy += 0.05
            }
            this.advance()
            if (this.x - this.radius < 0) {
                this.x = this.radius
                this.dx = 0
            }
            if (this.x + this.radius > gameSetting.canvasWidth) {
                this.x = gameSetting.canvasWidth - this.radius
                this.dx = 0
            }
            if (this.y - this.radius < 0) {
                this.y = this.radius
                this.dy = 0
            }
            if (this.y + this.radius > gameSetting.canvasHeight) {
                this.y = gameSetting.canvasHeight - this.radius
                this.dy = 0
            }
            this.dt += 1/60

            if (keyPressed('space') && this.plasma >= 1 && this.dt > gameSetting.playerFireRate) {
                createPlasma(this.x, this.y - (this.radius * 2), (this.radius * 2))
                this.plasma -= gameSetting.plasmaBurnRate
                this.dt = 0
                
            }
            if (!keyPressed('space') && this.plasma < gameSetting.maxPlasma) {
                // this.plasma += gameSetting.plasmaRefillRate
                setTimeout(
                    () => {
                        playerSprite.plasma += gameSetting.plasmaRefillRate
                        if (playerSprite.plasma > gameSetting.maxPlasma) {
                            playerSprite.plasma = gameSetting.maxPlasma
                        }
                    },
                    Math.random() * 1000
                )
            }
        }
    })

    spriteArray.push(playerSprite)
    createHud()
}

function createHud() {
    let plasmaBar = Sprite({
        x: 80,
        y: 780,
        color: 'green',
        width: 120,
        height: 10,
        update() {
            this.width = playerSprite.plasma
            if (this.width < 50) this.color = 'red'
            if (this.width > 50 && this.width < 100) this.color = 'yellow'
            if (this.width > 100) this.color = 'green'
        }
    })
    spriteArray.push(plasmaBar)

    let plasmaTxt = Sprite({
        x: 10,
        y: gameSetting.canvasHeight - 10,
        color: 'white',
        width: this.plasma,
        render() {
            this.context.fillStyle = this.color;
            this.context.font = '15px Arial'
            this.context.fillText(`PLASMA: `, this.x, this.y)
        }

    })
    spriteArray.push(plasmaTxt)

    let playerScore = Sprite({
        x: gameSetting.canvasWidth - 250,
        y: gameSetting.canvasHeight - 10,
        color: 'white',
        width: this.plasma,
        render() {
            this.context.fillStyle = this.color;
            this.context.font = '15px Arial'
            this.context.fillText(`SCORE: ${gameSetting.playerScore}`, this.x, this.y)
        }

    })
    spriteArray.push(playerScore)
}

function collide(asteroid, plasma) {
    let dx = asteroid.x - plasma.x;
    let dy = asteroid.y - plasma.y;
    if (Math.sqrt(dx * dx + dy * dy) < asteroid.radius + plasma.radius) {
        gameSetting.playerScore += 10
        plasma.alive = false
        if (asteroid.dx > 0) asteroid.dx += asteroid.dy
        if (asteroid.dx < 0) asteroid.dx -= asteroid.dy
        asteroid.dy *= -0.5
        asteroid.hit = true
    }
}

let loop = GameLoop({
    update() {
        asteroidArray.map((sprite) => {sprite.update()})
        asteroidArray = asteroidArray.filter(sprite => sprite.alive)
        plasmaArray.map((sprite) => {sprite.update()})
        plasmaArray = plasmaArray.filter(sprite => sprite.alive)
        spriteArray.map((sprite) => {sprite.update()})
        // spriteArray = spriteArray.filter((sprite) => {sprite.isAlive()})
        if (!playerSprite.alive) {
            loop.stop()
        }
    },
    render() {
        asteroidArray.map((sprite) => {
            sprite.render()
        })
        plasmaArray.map((sprite) => {
            sprite.render()
        })
        spriteArray.map((sprite) => {
            sprite.render()
        })
    }
})

loop.start()
