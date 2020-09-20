const fs = require('fs')
const express = require('express')
const other = require('./main.js')
const bodyParser = require('body-parser')
const router = express.Router()
router.use(bodyParser.json())
router.use(bodyParser.urlencoded({
    extended: true
}));

router.route('/canvasTools/:tool')
    .post((req,res) =>
    {
        args = {
            "request": "POST",
            "action": req.params.tool.toLowerCase(),
            "data": req.body
        }
        other.processInput(args).then(msgVals => {
            res.status(msgVals.status).sendFile(msgVals.content, {}, () => {
                fs.unlinkSync(msgVals.content)
            })
        }).catch(err=>
        {
            res.status(err.status).json(err.content)
        })
    })
    .get((req,res) => {
        args = {
            "request": "GET",
            "action": req.params.tool.toLowerCase()
        }
        other.processInput(args).then(msgVals => {
            res.status(msgVals.status).sendFile(msgVals.content)
        }).catch(err=>
        {
            res.status(err.status).json(err.content)
        })
    })
module.exports = router