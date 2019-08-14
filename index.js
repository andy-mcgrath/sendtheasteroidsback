let ctx = document.getElementById('canvas').getContext('2d')

let game = {
    width: ctx.canvas.width,
    height: ctx.canvas.height,
    movement: {
        q: 0,
        a: 0,
        w: 0,
        s: 0
    },
    keyMap: {
        q: 1,
        a: 2,
        w: 4,
        s: 8
    },
    keyDown: function(keyPress) {
        let key = keyPress.key.toLowerCase()
        if (key in game.keyMap){
            game.movement[key] = game.keyMap[key]
        }
    },
    keyUp: function(keyPress) {
        let key = keyPress.key.toLowerCase()
        if (key in game.keyMap){
            game.movement[key] = 0
        }
    },
    direction: function() {
        switch (this.movement.q + this.movement.a + this.movement.w + this.movement.s) {
            case 0:
            case 3:
            case 12:
            case 15:
                return 'still'
            case 1:
            case 8:
            case 11:
            case 13:
                return 'slow right'
            case 2:
            case 4:
            case 7:
            case 14:
                return 'slow left'
            case 5:
                return 'forward'
            case 6:
                return 'fast left'
            case 9:
                return 'fast right'
            case 10:
                return 'reverse'
            default:
                return 'still'
        }
    },
    init: function() {
        window.addEventListener('keydown', game.keyDown, false)
        window.addEventListener('keyup', game.keyUp, false)
    }
}

function titleText(txt, options) {
    ctx.save()
    let shadowTemps = {
        color: ctx.shadowColor,
        blur: ctx.shadowBlur,
        offsetX: ctx.shadowOffsetX,
        offsetY: ctx.shadowOffsetY,
    }
    options = options || {}
    x = options.x || game.width/2
    y = options.y || game.height/2
    ctx.font = options.font || '900 50px Arial'
    ctx.textAlign = options.align || 'center'
    ctx.textBaseline = options.baseline || 'middle'
    ctx.fillStyle = 'rgba(256, 0, 0, 1.0)'
    ctx.strokeStyle = 'rgba(0, 0, 0, 1.0)'
    ctx.shadowColor = 'rgba(0, 0, 0, 1.0)'
    ctx.shadowBlur = 10
    ctx.shadowOffsetX = 10
    ctx.shadowOffsetY = 10

    ctx.fillText(txt, x, y)
    ctx.shadowColor = shadowTemps.color
    ctx.shadowBlur = shadowTemps.blur
    ctx.shadowOffsetX = shadowTemps.offsetX
    ctx.shadowOffsetY = shadowTemps.offsetY
    ctx.strokeText(txt, x, y)
}

function mainLoop() {
    ctx.clearRect(0, 0, game.width, game.height);
    titleText(game.direction())
    window.requestAnimationFrame(mainLoop);
}

game.init()
window.requestAnimationFrame(mainLoop)
