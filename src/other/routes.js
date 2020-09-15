const fs = require('fs')
const express = require('express')
const other = require('./main.js')
const bodyParser = require('body-parser')
const router = express.Router()
router.use(bodyParser.json())
router.use(bodyParser.urlencoded({
    extended: true
}));

router.route('/pixelPrinter')
    .post((req,res) =>
    {
        args = {
            "request": "POST",
            "action": "pixelPrinter",
            "data": req.body
        }
        var returnVal = other.processInput(args).then(msgVals => {
        if(msgVals["status"] == 200)
        {
            res.status(msgVals["status"]).sendFile(msgVals["content"], {}, () => {
                fs.unlinkSync(msgVals["content"])
            })
        }
        else
        {
            res.status(msgVals["status"]).json(msgVals["content"])
        }})
    })
module.exports = router