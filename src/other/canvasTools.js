const fs = require('fs')
const path = require('path')
const { createCanvas, loadImage } = require('canvas')
const { createContext } = require('vm')

async function generateColorSpectrum()
{
    const imagePath = path.resolve(__dirname + '/spectrum.png')
    if(!fs.existsSync(imagePath))
    {
        const constraints = {
            width: 4096,
            height: 4096
        }
        var colorSpectrumArr = []
        const canvas = createCanvas(constraints.width,constraints.height)
        const ctx = canvas.getContext('2d')
        const imagePath = path.resolve(__dirname + '/spectrum.png')
        const out = fs.createWriteStream(imagePath)
        const stream = canvas.createPNGStream()
        for(var r = 0; r<256; r++)
        {
            for(var g = 0; g<256; g++)
            {
                for(var b = 0; b<256; b++)
                {
                    colorSpectrumArr.push([r,g,b])
                }
            }
        }
        for(var y = 0; y<constraints.height; y++)
        {
            for(var x = 0; x<constraints.width; x++)
            {
                var rgb = colorSpectrumArr[(y*constraints.width)+x]
                ctx.fillStyle = `rgb(${rgb[0]},${rgb[1]},${rgb[2]})`
                ctx.fillRect(x,y, 1, 1)
            }
        }
        stream.pipe(out)
        return new Promise((resolve, reject) => {
            out.on('finish', arg => {
                resolve(imagePath)
            })
            out.on('error', arg => {
                reject()
            })
        })
    }
    return new Promise((resolve, reject) => {
        resolve(imagePath)
    })
}
async function generateNoise(width, height)
{
    if(width>0 && height > 0)
    {
        const canvas = createCanvas(width,height)
        const ctx = canvas.getContext('2d')
        const imagePath = path.resolve(__dirname + '/noise.png')
        const out = fs.createWriteStream(imagePath)
        const stream = canvas.createPNGStream()
        for(var y = 0; y<height; y++)
        {
            for(var x = 0; x<width; x++)
            {
                ctx.fillStyle = `rgb(${Math.floor(Math.random()*Math.floor(255))},`+
                `${Math.floor(Math.random()*Math.floor(255))},`+
                `${Math.floor(Math.random()*Math.floor(255))})`
                ctx.fillRect(x,y, 1, 1)
                tempArr = null
            }
        }
        stream.pipe(out)
        return new Promise((resolve, reject) => {
            out.on('finish', arg => {
                resolve(imagePath)
            })
            out.on('error', arg => {
                reject("Could not create image")
            })
        })
    }
    else
    {
        return new Promise((resolve, reject) =>{
            reject("Invalid dimension")
        })
    }
}

module.exports = {
    generateColorSpectrum,
    generateNoise
}