/*
a0: (0,0,0,0) [transparent]
t: BLACK
c: CYAN
d: DARK_GRAY
z: GRAY
g: GREEN
l: LIGHT_GRAY
m: MAGENTA
o: ORANGE
p: PINK
r: RED
w: WHITE
y: YELLOW
b: BLUE

{
    pixelSize:
    widthInPixels:
    heightInPixels:
    pixelString:
}
*/
const fs = require('fs')
const path = require('path')
const { createCanvas, loadImage } = require('canvas')
const colorMap = new Map()
const dimRestr = {
    "width": 1000,
    "height": 1000
}
function initColorMap()
{
    colorMap.set("a0", [0,0,0,0])
    colorMap.set("t", [0,0,0,1])
    colorMap.set("c", [0,255,255,1])
    colorMap.set("d", [60,60,60,1])
    colorMap.set("z", [120,120,120,1])
    colorMap.set("g", [0,255,0,1])
    colorMap.set("l", [180,180,180,1])
    colorMap.set("m", [255,20,150,1])
    colorMap.set("o", [255,125,80,1])
    colorMap.set("p", [255,150,200,1])
    colorMap.set("r", [255,0,0,1])
    colorMap.set("w", [255,255,255,1])
    colorMap.set("y", [255,255,0,1])
    colorMap.set("b", [0,0,255,1])
}
function validInput(input)
{
    var validArr = [false, false, false, false]
    if(typeof(input["pixelSize"]) === "number" && input["pixelSize"]%1 === 0)
    {
        if(input["pixelSize"] > 0)
        {
            validArr[0] = true
        }
        else
        {
            return false
        }
    }
    else
    {
        return false
    }
    if(typeof(input["widthInPixels"]) === "number" && input["widthInPixels"]%1 === 0)
    {
        if(input["widthInPixels"] > 0)
        {
            if(input["widthInPixels"]*input["pixelSize"]<=dimRestr["width"])
            {
                validArr[1] = true
            }
        }
    }
    if(typeof(input["heightInPixels"]) === "number" && input["heightInPixels"]%1 === 0)
    {
        if(input["heightInPixels"] > 0)
        {
            if(input["heightInPixels"]*input["pixelSize"]<=dimRestr["height"])
            {
                validArr[2] = true
            }
        }
    }
    if(typeof(input["pixelString"]) === "string" && input["pixelString"].length > 0)
    {
        if(input["pixelString"].split(" ").length == input["heightInPixels"] * input["widthInPixels"])
        {
            validArr[3] = true
        }
    }
    return validArr.every(pass => {return pass})
}
function process(input)
{
    const imagePath = path.resolve(__dirname + '/image.png')
    const out = fs.createWriteStream(imagePath)
    const width = input["widthInPixels"]
    const height = input["heightInPixels"]
    const pixelSize = input["pixelSize"]
    const pixelArr = input["pixelString"].split(" ")
    const canvas = createCanvas(width*pixelSize,height*pixelSize)
    const ctx = canvas.getContext('2d')
    const stream = canvas.createPNGStream()
    for(var y = 0; y<height; y += 1)
    {
        for(var x = 0; x<width; x += 1)
        {
            var rgba = colorMap.get(pixelArr[(y*width)+x])
            if(typeof(rgba) === "undefined")
            {
                rgba = colorMap.get("a0")
            }
            var fillString = "rgba("
            rgba.forEach(val =>{
                fillString += `${val},`
            })
            fillString = fillString.substring(0, fillString.length-1) + ")"
            ctx.fillStyle = fillString
            ctx.fillRect(x*pixelSize,y*pixelSize, pixelSize, pixelSize)
        }
    }
    stream.pipe(out)
    return new Promise((resolve, reject) => {
        out.on('finish', arg => {
            resolve(imagePath)
        })
    })
}
module.exports = {
    validInput,
    process,
    initColorMap
}