const fs = require('fs')
const path = require('path')
const config = JSON.parse(fs.readFileSync(path.resolve(__dirname,'config.json')))
class Node{
    constructor(letter)
    {
        this.letter = letter
        this.left = null
        this.right = null
    }
}
class MorseTree{
    constructor()
    {
        this.root = new Node(`/`)
    }
    get(data)
    {
        return this.getNode(data, this.root)
    }
    getNode(morse, node)
    {
        if(morse.length === 0)
        {
            return node.letter
        }
        else if(morse.charAt(0) === `.`)
        {
            return this.getNode(morse.substring(1), node.right)
        }
        else if(morse.charAt(0) === `-`)
        {
            return this.getNode(morse.substring(1), node.left)
        }
        else
        {
            return " "
        }
    }
    insert(letter, morse)
    {
        return this.insertNode(morse, this.root, letter)
    }
    insertNode(morseStr, node, newLetter)
    {
        if(morseStr.length === 0)
        {
            node.letter = newLetter
        }
        if(morseStr.charAt(0) === `.`)
        {
            if(node.right === null)
            {
                node.right = new Node('')
            }
            return this.insertNode(morseStr.substring(1), node.right, newLetter)
        }
        else if(morseStr.charAt(0) === `-`)
        {
            if(node.left === null)
            {
                node.left = new Node('')
            }
            return this.insertNode(morseStr.substring(1), node.left, newLetter)
        }
        else
        {
            return false
        }
    }
}
const Letters = [
    `a`, `b`, `c`, `d`, `e`, `f`, `g`, `h`,
    `i`, `j`, `k`, `l`, `m`, `n`, `o`, `p`,
    `q`, `r`, `s`, `t`, `u`, `v`, `w`, `x`,
    `y`, `z`, `0`, `1`, `2`, `3`, `4`, `5`,
    `6`, `7`, `8`, `9`, `.`, `,`, `?`, `:`,
    `/`, `-`, `=`, "`", `-`, `!`,`&`, `"`, 
    `;`, `$`, ` `]
const Morse = [
    `.-`,     `-...`,    `-.-.`,   `-..`,    `.`,
    `..-.`,   `--.`,     `....`,   `..`,     `.---`,
    `-.-`,    `.-..`,    `--`,     `-.`,     `---`,
    `.--.`,   `--.-`,    `.-.`,    `...`,    `-`,
    `..-`,    `...-`,    `.--`,    `-..-`,   `-.--`,
    `--..`,   `.----`,   `..---`,  `...--`,  `....-`,
    `.....`,  `-....`,   `--...`,  `---..`,  `----.`,
    `-----`,  `.-.-.-`,  `--..--`, `..--..`, `---...`,
    `-..-.`,  `-....-`,  `-...-`,  `.----.`, `..--.-`,  
    `-.-.--`, `.-...`,  `.-..-.`, `-.-.-.`, `...-..-`, `/`]
const MorseMap = new Map()
var tree = new MorseTree()
function init()
{
    for(var I = 0; I<Letters.length; I++)
    {
        MorseMap.set(Letters[I], Morse[I])
    }
    for(var I = 0; I<Letters.length; I++)
    {
        tree.insert(Letters[I], Morse[I])
    }
    for(var I = 0; I<Morse.length; I++)
    {
    var foundLetter = tree.get(Morse[I])
    if(Letters[I] != foundLetter)
    {
        console.log(`Failure finding ${Letters[I]}, got ${foundLetter}`)
    }
}
    return true
}
function encryptFunc(Text) {
    var final = {
        "morse": ""
    }
    var morseStr = ""
    for(var I = 0; I<Text.length; I++)
    {
        morseStr += `${MorseMap.get(Text.charAt(I))} `
    }
    morseStr = morseStr.substring(0, morseStr.length-1)
    final["morse"] = morseStr;
    return final;
}
function decryptFunc(Morse) {
    var final = {
        "text": ""
    }
    var decoded = ""
    Morse.split(' ').forEach(morse =>{
        decoded += tree.get(morse)
    })
    final["text"] = decoded
    return final;
}
function processData(action, data)
{
    if(action==="encrypt")
    {
        return encryptFunc(data["text"])
    }
    else if(action==="decrypt")
    {
        return decryptFunc(data["morse"])
    }
    else
    {
        return "Error"
    }
}
function validateInput(action, data)
{
    const regExTest = new RegExp(/^[.-/ ]+$/)
    if(action === "encrypt")
    {
        return data["text"].length !==0
    }
    else if(action === "decrypt")
    {
        return (data["morse"].length !==0 && regExTest.test(data["morse"]))
    }
    return false
}
module.exports = {
    processData,
    validateInput,
    init,
    config
}