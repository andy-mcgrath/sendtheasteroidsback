let ctx = document.getElementById('canvas').getContext('2d')

window.addEventListener('keydown', keyDown, false)
window.addEventListener('keyup', keyUp, false)

let game = {
    width: ctx.canvas.width,
    height: ctx.canvas.height,
    movement: {
        q: 0,
        a: 0,
        w: 0,
        s: 0
    },
    direction: 'still'
}

//let scream = new Image()
//scream.src = 'scream.jpg'

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
    // direction()
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
    // direction()
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
        case 8:
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
    y = options.y || game.width/2
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
    titleText(game.direction)

    // titleText('Hello World!')
    // ctx.translate(1, 0)

    window.requestAnimationFrame(mainLoop);
}

window.requestAnimationFrame(mainLoop)
