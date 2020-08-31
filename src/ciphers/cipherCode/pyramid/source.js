const BinaryClass = require("./binary.js");
const fs = require('fs')
const path = require('path')
const config = JSON.parse(fs.readFileSync(path.resolve(__dirname,'config.json')))
function generatePyramid(length) {
    var total = 1, count1 = 1, j = 0;
    var encodeints = [];
    encodeints.push(1);
    while (total < length) {
        for (j = 0; j < count1; j++) {
            if (total < length) {
                encodeints.push(j + 1);
                total++;
            }
        }
        for (j = count1; j >= 0; j--) {
            if (total < length) {
                encodeints.push(j + 1);
                total++;
            }
        }
        count1++;
    }
    return encodeints;
}
function operation(input, opNum, modifier) {
    var top = 0;
    var bottom = 0;
    if (input >= 97 && input <= 122) {
        top = 122;
        bottom = 97;
    }
    else if (input >= 65 && input <= 90) {
        top = 90;
        bottom = 65;
    }
    else {
        return input;
    }
    if (opNum === 1) {
        for (var I = 0; I < modifier; I++) {
            if (input != top) {
                input++;
            }
            else {
                input = bottom;
            }
        }
    }
    else {
        for (var I = 0; I < modifier; I++) {
            if (input != bottom) {
                input--;
            }
            else {
                input = top;
            }
        }
    }
    return input;
}
function stringToInt(input) {
    var output = [];
    var temp = "";
    temp = input;
    for (var I = 0; I < temp.length; I++) {
        output.push(temp.charCodeAt(I));
    }
    return output;
}
function intToString(input) {
    var output = "";
    var temp = [];
    temp = input;
    for (var I = 0; I < temp.length; I++) {
        output += String.fromCharCode(input[I]);
    }
    return output;
}
function randomString(length, excludedChars)
{
    var returnVal = ``
    var charInt = 0
    if(((typeof length === 'number') && (length % 1 === 0))
    &&(Array.isArray(excludedChars)&&excludedChars.every(char => {return typeof char === 'string'})))
    {
        for(var I = 0; I<length; I++)
        {
            charInt = (Math.floor(Math.random() * Math.floor(94))+33)
            while(excludedChars.includes(String.fromCharCode(charInt)))
            {
                charInt = (Math.floor(Math.random() * Math.floor(94))+33)
            }
            returnVal += String.fromCharCode(charInt)
        }
    }
    return returnVal
}
function encryptFunc(textEntry, KeyText) {
    var final = {
        "text": "",
        "key": ""
    }
    var midstep = stringToInt(textEntry);
    var pyramid = generatePyramid(textEntry.length);
    var Key = ""
    if(KeyText.length===0)
    {
        var newKey = randomString(15,[])
        Key = BinaryClass.stringToBinary(randomString(15,['-']))
    }
    else
    {
        Key = BinaryClass.stringToBinary(KeyText);
    }
    for (var K = 0; K < Key.length; K++) {
        for (var I = 0; I < midstep.length; I++) {
            midstep[I] = operation(midstep[I], Key[K], pyramid[I]);
        }
    }
    final["text"] = intToString(midstep);
    final["key"] = BinaryClass.binaryToString(Key);
    return final;
}
function decryptFunc(Text, Key) {
    var output = {
        "text": ""
    };
    var midstep = stringToInt(Text);
    var decrypt = BinaryClass.notOp(BinaryClass.stringToBinary(Key));
    var pyramid = generatePyramid(Text.length);
    for (var K = 0; K < decrypt.length; K++) {
        for (var I = 0; I < midstep.length; I++) {
            midstep[I] = operation(midstep[I], decrypt[K], pyramid[I]);
        }
    }
    output["text"] = intToString(midstep);
    return output;
}
function processData(action, data)
{
    if(action==="encrypt")
    {
        return encryptFunc(data["text"], data["key"])
    }
    else if(action==="decrypt")
    {
        return decryptFunc(data["text"], data["key"])
    }
    else
    {
        return "Error"
    }
}
function validateInput(action, data)
{
    var validKey = false
    var validText = false
    if(action === "encrypt")
    {
        validText = (data["text"].length !==0)
        validKey = true
    }
    else if(action === "decrypt")
    {
        validText = (data["text"].length !==0)
        validKey = (data["key"].length !== 0)
    }
    return (validText&&validKey)
}
module.exports = {
    processData,
    validateInput,
    config
}

