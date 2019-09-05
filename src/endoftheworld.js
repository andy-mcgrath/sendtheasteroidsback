let {
    init,
    initKeys,
    imageAssets,
    keyPressed,
    load,
    getStoreItem,
    setStoreItem, 
    GameLoop,
    Pool,
    Sprite
} = kontra;

let gameSetting = {
    playerAcc: 0.1,
    playerScore: 0,
    maxPlasma: 150,
    plasmaBurnRate: 2,
    plasmaRefillRate: 0.5,
    playerFireRate: 0,
    plasmaTtl: 160,
    canvasHeight: 800,
    canvasWidth: 800,
    highScore: getStoreItem('highScore') || 0
}

init();
initKeys();

let playerSprite

let asteroidArray = []
let plasmaArray = []
let spriteArray = []


let loop = GameLoop({
    update() {
        playerSprite.update()
        asteroidArray.map((sprite) => {sprite.update()})
        asteroidArray = asteroidArray.filter(sprite => sprite.alive)
        plasmaArray.map((sprite) => {sprite.update()})
        plasmaArray = plasmaArray.filter(sprite => sprite.alive)
        spriteArray.map((sprite) => {sprite.update()})
        if (!playerSprite.alive) {
            loop.stop()
            if (gameSetting.playerScore > gameSetting.highScore) {
                setStoreItem('highScore', gameSetting.playerScore)
            }
        }
    },
    render() {
        playerSprite.render()
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

function createAsteroids(number) {
    for (let i = 0; i < number; i++) {
        setTimeout(() => createAsteroid(), Math.random() * 5000)
    }
}

function createPlayer() {
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
        image: imageAssets['img/astronaught01'],
        update() {
            if (keyPressed('left')) {
                if (this.dx > 0) {
                    this.dx -= gameSetting.playerAcc * 2
                } else {
                    this.dx -= gameSetting.playerAcc
                }
            }
            if (keyPressed('right')) {
                if (this.dx < 0) {
                    this.dx += gameSetting.playerAcc * 2
                } else {
                    this.dx += gameSetting.playerAcc
                }
            }
            if (!keyPressed('left') && !keyPressed('right')) {
                if (this.dx < gameSetting.playerAcc && this.dx > -gameSetting.playerAcc) {
                    this.dx = 0
                } else if (this.dx > 0) {
                    this.dx -= 0.01
                } else {
                    this.dx += 0.01
                }
            }
            if (keyPressed('up')) {
                this.dy -= gameSetting.playerAcc
            }
            if (keyPressed('down')) {
                this.dy += gameSetting.playerAcc
            }
            if (!keyPressed('up') && !keyPressed('down')) {
                if (this.dy < gameSetting.playerAcc && this.dy > -gameSetting.playerAcc) {
                    this.dy = 0
                } else if (this.dy > 0) {
                    this.dy -= 0.01
                } else {
                    this.dy += 0.01
                }
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
            if (this.y + this.radius > gameSetting.canvasHeight - 30) {
                this.y = gameSetting.canvasHeight - this.radius - 30
                this.dy = 0
            }
            this.dt += 1/60

            if (keyPressed('space') && this.plasma >= 1 && this.dt > gameSetting.playerFireRate) {
                createPlasma(this.x, this.y - (this.radius * 2), (this.radius * 2))
                this.plasma -= gameSetting.plasmaBurnRate
                this.dt = 0
                
            }
            if (!keyPressed('space') && this.plasma < gameSetting.maxPlasma) {
                this.plasma += gameSetting.plasmaRefillRate
                if (playerSprite.plasma > gameSetting.maxPlasma) {
                    playerSprite.plasma = gameSetting.maxPlasma
                }
            }
        }
    })
}

function random(number) {
    return Math.round(Math.random() * number)
}

function createAsteroid() {
    let size = random(40) + 20
    let asteroid = Sprite({
        type: 'asteroid',
        alive: true,
        hit: false,
        x: random(gameSetting.canvasWidth),
        y: random(-30),
        anchor: {x: 0.5, y: 0.5},
        dx: (Math.random() * 3) - 1.5,
        dy: Math.random(),
        ddy: 0.008,
        radius: size / 2,
        height: size,
        width: size,
        rotation: Math.random() * (Math.PI * 2),
        rotationSpeed: Math.random() - 0.5,
        image: imageAssets['img/asteroid01'],
        update() {
            this.rotation += this.rotationSpeed
            this.advance()
            if ((this.x + this.radius < 0) || (this.x - this.radius > gameSetting.canvasWidth) || (this.y < -30)) {
                this.alive = false
                if (this.hit) {
                    gameSetting.playerScore += 100
                }
                setTimeout(() => createAsteroid(), Math.random() * 5000)
            }
            if (this.collidesWith(playerSprite)) {
                playerSprite.alive = false
            }
            if (this.y + this.radius > gameSetting.canvasHeight) {
                playerSprite.alive = false
            }
        }
    })
    asteroidArray.push(asteroid)
}

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
        image: imageAssets['img/plasma01'],
        ttl: gameSetting.plasmaTtl,
        update() {
            this.ttl -= 1
            if (this.ttl < 1) {
                this.alive = false
            }
            asteroidArray.map((asteroid) => {collide(asteroid, this)})
        }
    })
    plasmaArray.push(plasma)
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
        x: gameSetting.canvasWidth - 450,
        y: gameSetting.canvasHeight - 10,
        color: 'white',
        width: this.plasma,
        render() {
            this.context.fillStyle = this.color;
            this.context.font = '15px Arial'
            this.context.fillText(`SCORE: ${gameSetting.playerScore}\tHIGH SCORE: ${gameSetting.highScore}`, this.x, this.y)
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
        if (asteroid.x > plasma.x) {
            asteroid.dx *= 2
        } else {
            asteroid.dx *= -1
        }
        if (asteroid.y > plasma.y) {
            asteroid.dy *= 2
        } else {
            asteroid.dy *= -1
        }
        asteroid.hit = true
    }
}

load(
    'img/astronaught01.png',
    'img/plasma01.png',
    'img/asteroid01.png'
).then(() => {
    createPlayer()
    createAsteroids(5)
    createHud()
    loop.start()
})