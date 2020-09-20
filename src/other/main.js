const name = `other`
const fs = require('fs')
const pixelPrinter = require('./pixelPrinter.js')
const canvasTools = require('./canvasTools.js')
function init()
{
    
}
async function processInput(input)
{
    var content = {
        "content": "",
        "status": 200
    }
    if(typeof(input.request) !== "undefined" && input.request.length > 0)
    {
        if(input.request === "POST")
        {
            if(typeof(input.action) !== "undefined" && input.action.length > 0)
            {
                if(input.action == "pixelprinter")
                {
                    if(typeof(input.data) !== "undefined")
                    {
                        await pixelPrinter.process(input.data).then(result => {
                            content.content = result
                        }).catch(error =>{
                            content.content = error
                            content.status = 400
                        })
                    }
                    else
                    {
                        content.content = "No data provided"
                        content.status = 400
                    }
                }
                else if(input.action == "static")
                {
                    if(typeof(input.data) !== "undefined")
                    {
                        if(typeof(input.data.width)==="number"&&typeof(input.data.height)==="number")
                        {
                            if(input.data.width%1===0&&input.data.height%1===0)
                            {
                                await canvasTools.generateNoise(input.data.width, input.data.height).then(result =>{
                                    content.content = result
                                }).catch(err=>{
                                    content.content = err
                                    content.status = 400
                                })
                            }
                            else
                            {
                                content.content = "Width or height are floats. Ensure both arguments are integers"
                                content.status = 400
                            }
                        }
                        else
                        {
                            content.content = "Missing width or height. Ensure both arguments are present"
                            content.status = 400
                        }
                    }
                    else
                    {
                        content.content = "No data provided"
                        content.status = 400
                    }

                }
                else
                {
                    content.content = "Action does not exist"
                    content.status = 400
                }
            }
            else
            {
                content.content = "No action provided"
                content.status = 400
            }
        }
        else if(input.request === "GET")
        {
            if(input.action === "colorspectrum")
            {
                await canvasTools.generateColorSpectrum().then(result =>{
                    content.content = result
                }).catch(err=>{
                    content.content = err
                    content.status = 400
                })
            }
            else
            {
                content.content = "Action does not exist"
                content.status = 400
            }
        }
        else
        {
            content.content = "Cannot process request"
            content.status = 400
        }
    }
    else
    {
        content.content = "No request provided"
        content.status = 400
    }
    return new Promise((resolve, reject) =>{
        if(content.status === 200)
        {
            resolve(content)
        }
        else
        {
            reject(content)
        }
    })
}

module.exports = {
    processInput,
    init,
    name
}