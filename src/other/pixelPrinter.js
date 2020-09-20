const fs = require('fs')
const path = require('path')
const { createCanvas, loadImage } = require('canvas')
const canvasTools = require("./canvasTools.js")
const dimRestr = {
    "width": 1000,
    "height": 1000
}
class ColorPair{
    constructor(abrv, fullname, rgbaArr)
    {
        this.code = abrv
        this.name = fullname
        this.rgba = rgbaArr
    }
}
const colorMap = new Map([
    ["a0", new ColorPair("a0", "Transparent", [0,0,0,0])],
    ["b", new ColorPair("b", "Black",[0,0,0,1])],
    ["c", new ColorPair("c", "Cyan", [0,255,255,1])],
    ["dg", new ColorPair("dg", "Dark Gray", [60,60,60,1])],
    ["g", new ColorPair("g", "Gray", [120,120,120,1])],
    ["gr", new ColorPair("gr", "Green", [0,255,0,1])],
    ["lg", new ColorPair("lg", "Light Gray", [180,180,180,1])],
    ["m", new ColorPair("m", "Magenta", [255,20,150,1])],
    ["o", new ColorPair("o", "Orange", [255,125,80,1])],
    ["pi", new ColorPair("pi", "Pink", [255,150,200,1])],
    ["r", new ColorPair("r", "Red", [255,0,0,1])],
    ["w", new ColorPair("w", "White", [255,255,255,1])],
    ["y", new ColorPair("y", "Yellow", [255,255,0,1])],
    ["bl", new ColorPair("bl", "Blue", [0,0,255,1])]
])
function colorList(){
    return colorMap.values()
}
function validInput(input)
{
    const reqFields = ["pixelSize", "widthInPixels", "heightInPixels", "pixelString"]
    var missingField = false
    var missingFieldList = ""
    reqFields.forEach(req => {
        if(typeof(input[req]) === "undefined")
        {
            missingField = true
            missingFieldList += req +", "
        }
    })
    if(missingField)
    {
        missingFieldList = missingFieldList.substr(0, missingFieldList.length - 2)
        return `Missing data fields ${missingFieldList}`
    }
    if(typeof(input["pixelSize"]) === "number")
    {
        if(input["pixelSize"]%1 === 0)
        {
            if(input["pixelSize"] <= 0)
            {
                return "PixelSize is less than or equal to 0. Input a number greater than 0"
            }
        }
        else
        {
            return "PixelSize argument is a float. Enter in an integer"
        }
    }
    else
    {
        return "PixelSize argument is not a number. Enter in an integer"
    }
    if(typeof(input["widthInPixels"]) === "number")
    {
        if(input["widthInPixels"]%1 === 0)
        {
            if(input["widthInPixels"] > 0)
            {
                if(input["widthInPixels"]*input["pixelSize"]>dimRestr["width"])
                {
                    return `widthInPixels value is greater than the restriction. Keep this argument under ${dimRestr["width"]}`
                }
            }
            else
            {
                return "widthInPixels is less than or equal to 0. Input a number greater than 0"
            }
        }
        else
        {
            return "widthInPixels argument is a float. Enter in an integer"
        }
    }
    else
    {
        return "widthInPixels argument is not a number. Enter in an integer"
    }
    if(typeof(input["heightInPixels"]) === "number")
    {
        if(input["heightInPixels"]%1 === 0)
        {
            if(input["heightInPixels"] > 0)
            {
                if(input["heightInPixels"]*input["pixelSize"]>dimRestr["height"])
                {
                    return `heightInPixels value is greater than the restriction. Keep this argument under ${dimRestr["height"]}`
                }
            }
            else
            {
                return "heightInPixels is less than or equal to 0. Input a number greater than 0"
            }
        }
        else
        {
            return "heightInPixels argument is a float. Enter in an integer"
        }
    }
    else
    {
        return "heightInPixels argument is not a number. Enter in an integer"
    }
    if(typeof(input["pixelString"]) === "string")
    {
        if(input["pixelString"].length > 0)
        {
            const expectedPixels = input["heightInPixels"] * input["widthInPixels"]
            const actualPixels = input["pixelString"].split(" ").length
            if(actualPixels !== expectedPixels)
            {
                return `pixelString argument does not have enough pixel characters. ` + 
                `Make sure there are ${expectedPixels} ` +
                `pixels in the pixelString. Currently there are ${actualPixels}`
            }
        }
        else
        {
            return "pixelString argument is empty. Add a value"
        }
    }
    else
    {
        return "pixelString argument is not a string. Enter in a string argument"
    }
    return "valid"
}
function process(input)
{
    var check = validInput(input)
    const imagePath = path.resolve(__dirname + '/pixel.png')
    const out = fs.createWriteStream(imagePath)
    if(check === "valid")
    {
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
                var rgbaArr = colorMap.get(pixelArr[(y*width)+x])
                if(typeof(rgbaArr) === "undefined")
                {
                    rgbaArr = colorMap.get("a0")
                }
                var fillString = "rgba("
                rgbaArr.rgba.forEach(val =>{
                    fillString += `${val},`
                })
                fillString = fillString.substring(0, fillString.length-1) + ")"
                ctx.fillStyle = fillString
                ctx.fillRect(x*pixelSize,y*pixelSize, pixelSize, pixelSize)
            }
        }
        stream.pipe(out)
    }
    return new Promise((resolve, reject) => {
        out.on('finish', arg => {
            resolve(imagePath)
        })
        if(check !== "valid")
        {
            reject(check)
        }
    })
}
module.exports = {
    validInput,
    process
}