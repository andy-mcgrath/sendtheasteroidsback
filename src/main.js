let { init, Sprite, GameLoop } = kontra

let { canvas } = init()

let ball001 = Sprite({
    x: 30,
    y: 30,
    color: 'blue',
    // width: 20,
    // height: 20,
    mass: 0.1,
    dx: 5,
    dy: 10,
    radius: 20,
    render: function() {
      if (this.dy > 1) {
        this.dy *= 1 + this.mass
      } else if (this.dy < -1) {
        this.dy *= 1 - this.mass
      } else {
        this.dy += this.mass
      }
      if (this.y - this.radius < 1 || this.y + this.radius > this.context.canvas.height) {
        this.dy = -(this.dy * 0.6);
        this.y += this.dy * 2
      }
      if (this.x < this.radius || this.x + this.radius > this.context.canvas.width) {
          this.dx = -(this.dx * 0.6);
          this.x += this.dx
        }
      this.context.fillStyle = this.color;
      this.context.beginPath();
      this.context.arc(this.x, this.y, this.radius, 0, 2  * Math.PI);
      this.context.fill();
    }
})

// update the game state
function update() { 
    ball001.update()
}

// render the game state
function render() {
    ball001.render()
}

let loop = GameLoop({
    // fps: 60,
    // clearCanvas: true,
    update,
    render
})

loop.start() // start the game


//with(new AudioContext)[1,1,3,3,5,5,6,6,6,7,7,7,7,7,7,8,8,9,9,9,9,9,10,10,10,11,11,11,11,12,12,12,13,13,13,13,13,14,14,14,14,14,14,15,15,15,15,15,16,16,16,16,16,17,17,17,17,17,17,17,18,18,18,18,18,18,18,18,19,19,19,19,19,19,20,20,20,20,20,21,21,21,21,22,22,22,22,22,22,23,23,23,24,24].map((v,i)=>{with(createOscillator())v&&start(e=[3,5,3,5,3,5,45,48,86,7,18,43,51,81,87,18,41,7,18,40,52,75,18,39,92,7,18,38,71,8,20,52,8,15,23,37,69,27,29,37,52,94,104,30,53,66,99,106,10,30,36,54,107,9,35,57,61,86,93,106,8,15,29,34,80,93,94,99,8,15,17,18,26,33,15,18,23,29,32,8,9,14,26,10,11,12,13,14,19,19,20,24,23,24][i]/5,connect(destination),frequency.value=988/1.06**v,type='sine',)+stop(e+.2)})
//https://xem.github.io/miniMusic/advanced.html