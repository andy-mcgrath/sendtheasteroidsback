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
    Sprite,
} = kontra;


init();
initKeys();

function generateVectorTowardsEarth() {
    let dy = Math.random() * 4 - 2
    if (dy < 0) dy *= -1
    return dy
}

let asteroid = Sprite({
    x: 50,
    y: 50,
    dx: Math.random() * 4 - 2,
    dy: generateVectorTowardsEarth(),
    radius: 30,
    colour: 'white',
    render() {
        this.context.strokeStyle = this.colour;
        this.context.beginPath();  // start drawing a shape
        this.context.arc(this.x, this.y, this.radius, 0, Math.PI*2);
        this.context.stroke();     // outline the circle
    },
    update() {
        if (keyPressed('left')){
            this.colour = 'red'
            this.dx -= 0.1
        }
        if (keyPressed('right')){
            this.colour = 'blue'
            this.dx += 0.1
        }
        if (keyPressed('up')){
            this.colour = 'yellow'
            this.dy -= 0.1
        }
        if (keyPressed('down')){
            this.colour = 'green'
            this.dy += 0.1
        }
        this.x += this.dx
        this.y += this.dy
    }
})

let loop = GameLoop({
    update() {
        asteroid.update();
    },
    render() {
        asteroid.render();
    }
});

loop.start();