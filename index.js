const express = require('express')
const info = require('./package.json')
const fs = require('fs')
const path = require('path')
const app = express();
const PORT = process.env.PORT || 4000;
var dependancyMap = new Map()
app.get('/', (req, res) => {
    var list = {
        "list": Array.from(dependancyMap.keys())
    }
    res.json(list)
});
app.get('/teapot', (req, res) =>
    res.status(418).send()
);
app.listen(PORT, () => {
    info.modules.forEach(depName =>
        {
            var srcpath = `${info.assetPath}/${depName}`
            var files = fs.readdirSync(path.resolve(__dirname, srcpath))
            if(files.includes("main.js")&&files.includes("routes.js")){
                var tempDep = require(`${srcpath}/main.js`)
                var tempRoute = require(`${srcpath}/routes.js`)
                if (typeof(tempDep.init) === "function"
                &&typeof(tempDep.processInput) === "function"
                &&typeof(tempRoute.router!=="undefined"))
                {
                    dependancyMap.set(tempDep.name, tempDep)
                    app.use(`/${depName}`, tempRoute)
                }
            }
        })
    dependancyMap.forEach(dependancy =>{
        dependancy.init()
    })
    console.log(`Your server is running on port ${PORT}`)
});