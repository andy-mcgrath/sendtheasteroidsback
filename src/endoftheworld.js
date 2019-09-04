let {
    init,
    initKeys,
    keyPressed,
    GameLoop,
    Pool,
    Sprite,
    SpriteSheet,
} = kontra;

let gameSetting = {
    maxPlasma: 150,
    plasmaBurnRate: 1,
    plasmaRefillRate: 0.2,
    plasmaTtl: 120
    
}

init();
initKeys();

let spriteArray = []

let blockPool = Pool({
    create: Sprite
})

function generateVectorTowardsEarth() {
    let dy = Math.random() * 4 - 2
    if (dy < 0) dy *= -1
    return dy
}

let plasma01 = document.getElementById('plasma01')
function createBlock(x, y, size) {
    blockPool.get({
        x: x,
        y: y,
        anchor: {x: 0.5, y: 0.5},
        width: size,
        height: size,
        image: plasma01,
        ttl: gameSetting.plasmaTtl
    })
}

let playerImg = document.getElementById('playerImg')
playerImg.onload = function() {
    playerSprite = Sprite({
        x: Math.random() * 800,
        y: Math.random() * 800,
        anchor: {x: 0.5, y: 0.5},
        dx: 0,
        dy: 0,
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
            this.x += this.dx
            this.y += this.dy
            if (this.x - this.radius < 0) {
                this.x = this.radius
                this.dx = 0
            }
            if (this.x + this.radius > 800) {
                this.x = 800 - this.radius
                this.dx = 0
            }
            if (this.y - this.radius < 0) {
                this.y = this.radius
                this.dy = 0
            }
            if (this.y + this.radius > 800) {
                this.y = 800 - this.radius
                this.dy = 0
            }
            if (keyPressed('space') && this.plasma >= 1) {
                createBlock(this.x, this.y - (this.radius * 2), (this.radius * 2))
                this.plasma -= gameSetting.plasmaBurnRate
            }
            if (!keyPressed('space') && this.plasma < gameSetting.maxPlasma) {
                this.plasma += gameSetting.plasmaRefillRate
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
        y: 790,
        color: 'white',
        width: this.plasma,
        render() {
            this.context.fillStyle = this.color;
            this.context.font = '15px Arial'
            this.context.fillText(`PLASMA: `, this.x, this.y)
        }

    })
    spriteArray.push(plasmaTxt)
}

let loop = GameLoop({
    update() {
        blockPool.update()
        spriteArray.map((sprite) => {
            sprite.update()
        })
    },
    render() {
        blockPool.render()
        spriteArray.map((sprite) => {
            sprite.render()
        })
    }
})

loop.start()
