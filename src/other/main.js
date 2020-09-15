const name = `other`
const fs = require('fs')
const pixelPrinter = require('./pixelPrinter.js')
function init()
{
    pixelPrinter.initColorMap()
}
async function processInput(input)
{
    var content = {
        "content": "",
        "status": 200
    }
    if(typeof(input["request"]) !== "undefined" && input["request"].length > 0)
    {
        if(input["request"] === "POST")
        {
            if(typeof(input["action"]) !== "undefined" && input["action"].length > 0)
            {
                if(input["action"] == "pixelPrinter")
                {
                    if(typeof(input["data"]) !== "undefined")
                    {
                        const reqFields = ["pixelSize", "widthInPixels", "heightInPixels", "pixelString"]
                        var missingField = false
                        var missingFieldList = ""
                        reqFields.forEach(req => {
                            if(typeof(input["data"][req]) === "undefined")
                            {
                                missingField = true
                                missingFieldList += req +", "
                            }
                        })
                        if(missingField)
                        {
                            missingFieldList = missingFieldList.substr(0, missingFieldList.length - 2)
                            content["content"] = `Missing data fields ${missingFieldList}`
                            content["status"] = 400
                        }
                        else
                        {
                            if(pixelPrinter.validInput(input["data"]))
                            {
                                content["content"] = await pixelPrinter.process(input["data"])
                            }
                            else
                            {
                                content["content"] = "Provided data is invalid"
                                content["status"] = 400
                            }
                        }
                    }
                    else
                    {
                        content["content"] = "No data provided"
                        content["status"] = 400
                    }
                }
                else
                {
                    content["content"] = "Action does not exist"
                    content["status"] = 400
                }
            }
            else
            {
                content["content"] = "No action provided"
                content["status"] = 400
            }
        }
        else if(input["request"] === "GET")
        {
            if(typeof(input["action"]) !== "undefined" && input["action"].length > 0)
            {
                if(input["action"] == "staticImage")
                {
                    
                }
                else
                {
                    content["content"] = "Action does not exist"
                    content["status"] = 400
                }
            }
            else
            {
                content["content"] = "No action provided"
                content["status"] = 400
            }
        }
        else
        {
            content["content"] = "Cannot process request"
            content["status"] = 400
        }
    }
    else
    {
        content["content"] = "No request provided"
        content["status"] = 400
    }
    return content
}

module.exports = {
    processInput,
    init,
    name
}