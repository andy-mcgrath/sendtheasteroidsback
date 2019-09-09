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
    Sprite,
    SpriteSheet
} = kontra;

let gameSetting = {
    level: 1,
    asteroids: 0,
    playerAcc: 0.1,
    playerScore: 0,
    maxPlasma: 150,
    plasmaBurnRate: 10,
    plasmaRefillRate: 1,
    playerFireRate: 0.1,
    plasmaTtl: 140,
    canvasHeight: 800,
    canvasWidth: 800,
    highScore: getStoreItem('highScore') || 0
}

init();
initKeys();

let playerSprite

let asteroidArray = []
let asteroidTrail = []
let plasmaArray = []
let spriteArray = []
let bgStars = Pool({
    create: Sprite
})


let loop = GameLoop({
    update() {
        bgStars.update()
        asteroidArray.map((sprite) => {sprite.update()})
        asteroidArray = asteroidArray.filter(sprite => sprite.alive)
        plasmaArray.map((sprite) => {sprite.update()})
        plasmaArray = plasmaArray.filter(sprite => sprite.alive)
        spriteArray.map((sprite) => {sprite.update()})
        playerSprite.update()
        if (!playerSprite.alive) {
            lostGame()
            // loop.stop()
            if (gameSetting.playerScore > gameSetting.highScore) {
                setStoreItem('highScore', gameSetting.playerScore)
            }
        }
        if (gameSetting.asteroids < 1) {
            gameSetting.level += 1
            startLevel()
        }
    },
    render() {
        bgStars.render()
        asteroidArray.map((sprite) => {
            sprite.render()
        })
        plasmaArray.map((sprite) => {
            sprite.render()
        })
        spriteArray.map((sprite) => {
            sprite.render()
        })
        playerSprite.render()
    }
})

function startLevel() {
    plasmaArray = []
    switch (gameSetting.level){
        case 1:
            createBg()
            createPlayer()
            createAsteroids(5, 10000)
            createHud()
            loop.start()
            break
        case 2:
            gameSetting.plasmaBurnRate += 1
            createAsteroids(7, 9000)
            break
        case 3:
            gameSetting.plasmaBurnRate += 2
            createAsteroids(9, 8000)
            break
        case 4:
            gameSetting.plasmaBurnRate += 3
            createAsteroids(11, 7000)
            break
        case 5:
            gameSetting.plasmaBurnRate += 4
            createAsteroids(13, 5000)
            break
        case 6:
            gameSetting.plasmaBurnRate += 5
            createAsteroids(15, 4000)
            break
        case 7:
            gameSetting.plasmaBurnRate += 6
            createAsteroids(17, 3000)
            break
        case 8:
            gameSetting.plasmaBurnRate += 7
            createAsteroids(19, 2000)
            break
        default:
            plasmaArray = []
            spriteArray = []
            bgStars.get({
                x: 300,
                y: 400,
                render() {
                    this.context.fillStyle = 'rgba(255, 255, 255, 1.0)'
                    this.context.font = '50px Monospace'
                    this.context.fillText(`YOU SAVED THE EARTH`, this.x, this.y)
                }
            })
            loop.stop()
    }
    createLevelTitle()
}

function createAsteroids(number, delay) {
    gameSetting.asteroids = number
    for (let i = 0; i < number; i++) {
        setTimeout(() => createAsteroid(), Math.random() * delay)
    }
}

function createPlayer() {
    playerSheet = SpriteSheet({
        image: imageAssets['img/astronaught'],
        frameHeight: 16,
        frameWidth: 16,
        animations: {
            default: {
                frames: '0..2',
                frameRate: 6
            }
        }
    })
    playerSprite = Sprite({
        type: 'player',
        alive: true,
        x: gameSetting.canvasWidth / 2,
        y: gameSetting.canvasHeight * 0.6,
        anchor: {x: 0.5, y: 0.5},
        dx: 0,
        dy: 0,
        dt: 0,
        width: 32,
        height: 32,
        radius: 16,
        plasma: gameSetting.maxPlasma,
        animations: playerSheet.animations,
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
                    gameSetting.asteroids -= 1
                } else {
                    setTimeout(() => createAsteroid(), Math.random() * 5000)
                }
            }
            if (this.y + this.radius > gameSetting.canvasHeight) {
                playerSprite.alive = false
            }
        }
    })
    asteroidArray.push(asteroid)
}

function createPlasma(x, y, size) {
    let plasmaSheet = SpriteSheet({
        image: imageAssets['img/Plasma02'],
        frameHeight: 11,
        frameWidth: 11,
        animations: {
            default: {
                frames: [0,1],
                frameRate: 6
            }
        }

    })
    let plasma = Sprite({
        type: 'plasma',
        alive: true,
        x: x,
        y: y,
        dy: -1,
        anchor: {x: 0.5, y: 0.5},
        width: size,
        height: size,
        radius: size / 2,
        animations: plasmaSheet.animations,
        ttl: gameSetting.plasmaTtl,
        alpha: 1,
        update() {
            if (this.ttl < 1) {
                this.alive = false
            } else if (this.ttl < (gameSetting.plasmaTtl - 50) && this.dy != 0) {
                this.dy = 0
            }
            this.alpha = this.ttl / gameSetting.plasmaTtl
            this.advance()
            asteroidArray.map((asteroid) => {collide(asteroid, this)})
        }
    })
    plasmaArray.push(plasma)
}

function createBg() {
    for (let i = 0; i < 100; i++) {
        let size = random(2) + 1
        bgStars.get({
            x: random(gameSetting.canvasWidth),
            y: random(gameSetting.canvasHeight),
            color: `rgba(255, 255, 255, ${Math.random()})`,
            width: size,
            height: size
        })
    }
}

function createLevelTitle() {
    bgStars.get({
        x: 300,
        y: 400,
        anchor: {x: 0.5, y: 0.5},
        ttl: 240,
        render() {
            this.context.fillStyle = `rgba(0, 125, 255, ${this.ttl / 240})`
            this.context.font = '50px Monospace'
            this.context.fillText(`level ${gameSetting.level}`, this.x, this.y)
        }
    })
}

function lostGame() {
    plasmaArray = []
    asteroidArray = []
    spriteArray = []
    playerSprite.x = gameSetting.canvasWidth / 2
    playerSprite.y = gameSetting.canvasHeight / 2
    bgStars.get({
        x: 262,
        y: 420,
        anchor: {x: 0.5, y: 0.5},
        render() {
            this.context.fillStyle = `rgba(255, 0, 0, 0.5)`
            this.context.font = '50px Monospace'
            this.context.fillText('GAME OVER!', this.x, this.y)
        }
    })
    loop.stop()
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
            this.context.font = '15px Monospace'
            this.context.fillText(`plasma: `, this.x, this.y)
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
            this.context.font = '15px Monospace'
            this.context.fillText(`level: ${gameSetting.level}`, this.x, this.y)
        }

    })
    spriteArray.push(playerScore)

    let highScore = Sprite({
        x: gameSetting.canvasWidth - 250,
        y: gameSetting.canvasHeight - 10,
        color: 'white',
        width: this.plasma,
        render() {
            this.context.fillStyle = this.color;
            this.context.font = '15px Monospace'
            this.context.fillText(`asteroids remaining: ${gameSetting.asteroids}`, this.x, this.y)
        }

    })
    spriteArray.push(highScore)
}

function getDirection(sprite) {
    let direction = 0
    if (sprite.dy < 0) direction += 1
    if (sprite.dy > 0) direction += 2
    if (sprite.dx < 0) direction += 4
    if (sprite.dx > 0) direction += 8
    return direction
}

function collide(asteroid, plasma) {
    let dx = asteroid.x - plasma.x;
    let dy = asteroid.y - plasma.y;
    if (Math.sqrt(dx * dx + dy * dy) < asteroid.radius + plasma.radius) {
        gameSetting.playerScore += 10
        plasma.alive = false
        if (asteroid.x > plasma.x && asteroid.dx < 0) {
            if (asteroid.dx < 0) asteroid.dx *= -1.1
        } else {
            if (asteroid.dx > 0) asteroid.dx *= -1.1
        }
        if (asteroid.y > plasma.y) {
            if (asteroid.dy < 0) asteroid.dy *= -1.1
        } else {
            if (asteroid.dy > 0) asteroid.dy *= -1.1
        }
        asteroid.hit = true
    }
}

load(
    'img/astronaught.png',
    'img/Plasma02.png',
    'img/asteroid01.png'
).then(() => {
    startLevel()
})