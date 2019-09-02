// const ctx = document.getElementById('canvas').getContext('2d')
// ctx.canvas.style = 'border:1px solid white; cursor: none; padding: 0; margin: auto; display: block;'
// ctx.canvas.height = 800
// ctx.canvas.width = 800

// kontra.init();
// kontra.initKeys();

let {
    init,
    initKeys,
    keyPressed,
    GameLoop,
    Pool,
    Sprite,
} = kontra;

let spriteArray = [];

let blockPool = Pool({
    create: Sprite
})

init();
initKeys();
createPlayer()

function generateVectorTowardsEarth() {
    let dy = Math.random() * 4 - 2
    if (dy < 0) dy *= -1
    return dy
}

function createBlock(x, y, size) {
    blockPool.get({
            x: x,
            y: y,
            anchor: {x: 0.5, y: 0.5},
            color: 'green',
            width: size,
            height: size,
            ttl: 120
        })
}

function createPlayer() {
    spriteArray.push(
        Sprite({
            x: Math.random() * 800,
            y: Math.random() * 800,
            anchor: {x: 0.5, y: 0.5},
            dx: Math.random() * 4 - 2,
            dy: generateVectorTowardsEarth(),
            radius: 16,
            color: 'blue',
            plasma: 120,
            render() {
                this.context.fillStyle = this.color;
                this.context.strokeStyle = 'white';
                this.context.beginPath();  // start drawing a shape
                this.context.arc(this.x, this.y, this.radius, 0, Math.PI*2);
                this.context.stroke();     // outline the circle
                this.context.fill();     // outline the circle
            },
            update() {
                if (keyPressed('left')){
                    this.dx -= 0.05
                }
                if (keyPressed('right')){
                    this.dx += 0.05
                }
                if (keyPressed('up')){
                    this.dy -= 0.05
                }
                if (keyPressed('down')){
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
                if (keyPressed('space') && this.plasma > 0) {
                    createBlock(this.x, this.y - (this.radius * 2), (this.radius * 2))
                    this.plasma -= 1
                }
                if (!keyPressed('space') && this.plasma < 120) {
                    this.plasma += 1
                }
            }
        })
    )
}

let loop = GameLoop({
    update() {
        blockPool.update()
        spriteArray.map(sprite => sprite.update())
    },
    render() {
        blockPool.render()
        spriteArray.map(sprite => sprite.render())
    }
});

loop.start();