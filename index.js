let ctx = document.getElementById('canvas').getContext('2d')

let game = {
    width: ctx.canvas.width,
    height: ctx.canvas.height,
}

let scream = new Image()
scream.src = 'scream.jpg'
// scream.id = 'scream'

// let scream = document.getElementById('scream')
scream.onload = () => {ctx.drawImage(scream, 10, 10)}

titleText('Hello World!')


// ctx.drawImage(scream, 10, 10)

function titleText(txt, options) {
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
