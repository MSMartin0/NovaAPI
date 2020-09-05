 
const fs = require('fs')
const path = require('path')
const { type } = require('os')
const DependancyMap = new Map()
const config = JSON.parse(fs.readFileSync(path.resolve(__dirname,'config.json')))
const name = config.name
module.exports = {
    init,
    processInput,
    name
}
function init() {
    const repo = `.${config.basePath}`
    var cipherFolderList = fs.readdirSync(path.resolve(__dirname, config.basePath))
    cipherFolderList.forEach(folder =>
    {
        var canAdd = true
        var fileList = fs.readdirSync(path.resolve(`${__dirname}/${config.basePath}`, folder))
        if(fileList.includes(config.stdFileName))
        {
            var tempDep = require(path.resolve(`${__dirname}/${config.basePath}/${folder}`, config.stdFileName))
            if(typeof(tempDep.processData) === "function"
            &&typeof(tempDep.validateInput) === "function"
            &&typeof(tempDep.config) !== "undefined")
            {
                var configFile = tempDep.config
                if(typeof(configFile.name) !== "undefined")
                {
                    var iter = 0
                    while(iter<config.validActions.length && canAdd)
                    {
                        if(typeof(configFile[config.validActions[iter]]) === "undefined")
                        {
                            candAdd = false
                        }
                        iter++
                    }
                    if(typeof(tempDep.init)=== "function")
                    {
                        canAdd = tempDep.init()
                    }
                }
                else
                {
                    canAdd = false
                }
            }
            else
            {
                canAdd = false
            }
        }
        else
        {
            canAdd=false
        }
        if(canAdd)
        {
            DependancyMap.set(folder, require(`${__dirname}/${config.basePath}/${folder}/${config.stdFileName}`))
        }
    })
    console.log("Loaded in following dependancies:")
    console.log(Array.from(DependancyMap.keys()))
}
function processInput(input) {
    var content = {
        "content": "success",
        "status": 200
    }
    if(input["request"] === "POST")
    {
        content = postHandler(input)
    }
    else if(input["request"] === "GET")
    {
        content = getHandler(input)
    }
    else
    {
        content["content"] = "Unavailable request"
        content["status"] = 400
    }
    return content
}
function postHandler(input)
{
    var content = {
        "content": "success",
        "status": 200
    }
    if(DependancyMap.has(input["cipherID"]))
    {
        if(config.validActions.includes(input["action"]))
        {
            if(Object.keys(input["data"]).length !== 0)
            {
                var cipher = DependancyMap.get(input["cipherID"])
                var reqs = cipher.config[input["action"]]
                if(reqs !== "error")
                {
                    var inputData = input["data"]
                    var missingVal = false
                    var iter = 0
                    while(iter < reqs.length && !missingVal)
                    {
                        if(!inputData.hasOwnProperty(reqs[iter]))
                        {
                            missingVal = true
                        }
                        iter++
                    }
                    if(!missingVal)
                    {
                        if(cipher.validateInput(input["action"], inputData))
                        {
                            content["content"] = cipher.processData(input["action"],inputData)
                        }
                        else
                        {
                            content["content"] = "Invalid fields in file"
                            content["status"] = 400
                        }
                    }
                    else
                    {
                        content["content"] = "Missing fields in request"
                        content["status"] = 400
                    }
                }
                else
                {
                    content["content"] = "Requirement fetch failed"
                    content["status"] = 400
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
            content["content"] = "Valid action not provided"
            content["status"] = 400
        }
    }
    else
    {
        content["content"] = "Cipher does not exist"
        content["status"] = 400
    }
    return content
}
function getHandler(input)
{
    var content = {
        "content": "success",
        "status": 200
    }
    if(input.hasOwnProperty("action") && input["action"].length !== 0 && config.validActions.includes(input["action"])) 
    {
        if(input.hasOwnProperty("cipherID") && DependancyMap.has(input["cipherID"]))
        {
            if(input["action"] === "icon")
            {
                if(typeof(input["color"])!=="undefined")
                {
                    if(input["color"] === "dark" || input["color"] === "light")
                    {
                        var filePath = `${config.basePath}/${input["cipherID"]}/icon${input["color"]}.png`
                        if(fs.existsSync(path.resolve(__dirname,filePath)))
                        {
                            content["content"] = path.resolve(__dirname,filePath)
                        }
                    }
                    else
                    {
                        content["content"] = "Unavailable color provided"
                        content["status"] = 400
                    }
                        
                }
                else
                {
                    content["content"] = "No color provided"
                    content["status"] = 400
                }
            }
            else
            {
                content["content"] = DependancyMap.get(input["cipherID"]).config[input["action"]]
            }
        }
        else
        {
            content["content"] = "Invalid cipher provided"
            content["status"] = 400
        }
    }
    else
    {
        if(input.hasOwnProperty("cipherID"))
        {
            if(DependancyMap.has(input["cipherID"]))
            {
                content["content"] = DependancyMap.get(input["cipherID"]).config
            }
            else
            {
                content["content"] = "Invalid cipher provided"
                content["status"] = 400
            }
        }
        else
        {
            content["content"] = Array.from(DependancyMap.keys())
        }
    }
    return content
}