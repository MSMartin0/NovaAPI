var express = require('express')
var ciphers = require('./main.js')
var bodyParser = require('body-parser')
var router = express.Router()
router.use(bodyParser.json())
router.use(bodyParser.urlencoded({
    extended: true
}));

router.route('/:cipherID')
    .get((req,res) => {
        args = 
        {
            "request": "GET",
            "cipherID": req.params.cipherID,
            "action": ""
        }
        var msgVals = ciphers.processInput(args)
        res.status(msgVals["status"]).json(msgVals["content"])
    })
router.route('/:cipherID/icon/:color')
    .get((req,res) => {
        args = 
        {
            "request": "GET",
            "cipherID": req.params.cipherID,
            "action": "icon",
            "color": req.params.color
        }
        var msgVals = ciphers.processInput(args)
        if(msgVals["status"]===200)
        {
            res.status(msgVals["status"]).sendFile(msgVals["content"])
        }
        else
        {
            res.status(msgVals["status"]).json(msgVals["content"])
        }
    })
router.route('/:cipherID/:action')
    .post((req,res) => {
        args = 
        {
            "request": "POST",
            "cipherID": req.params.cipherID,
            "action": req.params.action,
            "data": JSON.parse(JSON.stringify(req.body))
        }
        var msgVals = ciphers.processInput(args)
        res.status(msgVals["status"]).json(msgVals["content"])
    })
    .get((req, res) => {
        args = 
        {
            "request": "GET",
            "cipherID": req.params.cipherID,
            "action": req.params.action
        }
        var msgVals = ciphers.processInput(args)
        res.status(msgVals["status"]).json(msgVals["content"])
    })
router.route('/')
    .get((req, res) => {
        args = 
        {
            "request": "GET",
        }
        var msgVals = ciphers.processInput(args)
        res.status(msgVals["status"]).json(msgVals["content"])
    })
module.exports = router