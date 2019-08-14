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
    // direction: 'still',
    keyDown: function(keyPress) {
        let key = keyPress.key.toLowerCase()
        let keyMap = {
            q: 1,
            a: 2,
            w: 4,
            s: 8
        }
        switch (key) {
            case 'q':
            case 'a':
            case 'w':
            case 's':
                game.movement[key] = keyMap[key]
                break
            default:
                break
        }
    },
    keyUp: function(keyPress) {
        let key = keyPress.key.toLowerCase()
        switch (key) {
            case 'q':
            case 'a':
            case 'w':
            case 's':
                    game.movement[key] = 0
                break
            default:
                break
        }
    },
    direction: function() {
        let movementNo = this.movement.q + this.movement.a + this.movement.w + this.movement.s
        switch (movementNo) {
            case 0:
            case 3:
            case 12:
            case 15:
                return 'still'
                break
            case 1:
            case 8:
            case 11:
            case 13:
                return 'slow right'
                break
            case 2:
            case 4:
            case 7:
            case 14:
                return 'slow left'
                break
            case 5:
                return 'forward'
                break
            case 6:
                return 'fast left'
                break
            case 9:
                return 'fast right'
                break
            case 10:
                return 'reverse'
                break
            default:
                return 'still'
                break
        }
    },
    init: function() {
        window.addEventListener('keydown', game.keyDown, false)
        window.addEventListener('keyup', game.keyUp, false)
    }
}

function keyDown(keyPress) {
    let key = keyPress.key.toLowerCase()
    let keyMap = {
        q: 1,
        a: 2,
        w: 4,
        s: 8
    }
    switch (key) {
        case 'q':
        case 'a':
        case 'w':
        case 's':
            game.movement[key] = keyMap[key]
        default:
            direction()
            break
    }
}

function keyUp(keyPress) {
    let key = keyPress.key.toLowerCase()
    switch (key) {
        case 'q':
        case 'a':
        case 'w':
        case 's':
            game.movement[key] = 0
        default:
            direction()
            break
    }
}

function direction() {
    let movementNo = game.movement.q + game.movement.a + game.movement.w + game.movement.s
    switch (movementNo) {
        case 0:
        case 3:
        case 12:
        case 15:
            game.direction = 'still'
            break
        case 1:
        case 8:width
        case 11:
        case 13:
            game.direction = 'slow right'
            break
        case 2:
        case 4:
        case 7:
        case 14:
            game.direction = 'slow left'
            break
        case 5:
            game.direction = 'forward'
            break
        case 6:
            game.direction = 'fast left'
            break
        case 9:
            game.direction = 'fast right'
            break
        case 10:
            game.direction = 'reverse'
            break
        default:
            game.direction = 'still'
            break
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
    ctx.shadowBlur = 1
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
    // ctx.drawImage(scream,10,10)
    // direction()
    titleText(game.direction())

    // titleText('Hello World!')
    // ctx.translate(1, 0)

    window.requestAnimationFrame(mainLoop);
}

game.init()
// window.addEventListener('keydown', game.keyDown, false)
// window.addEventListener('keyup', game.keyUp, false)
window.requestAnimationFrame(mainLoop)
