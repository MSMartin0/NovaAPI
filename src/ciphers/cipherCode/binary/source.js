const fs = require('fs')
const path = require('path')
const config = JSON.parse(fs.readFileSync(path.resolve(__dirname,'config.json')))
function notOp(Binary) {
    var NotBinary = [];
    for (var I = 0; I < Binary.length; I++) {
        if (Binary[I] === 1) {
            NotBinary.push(0);
        }
        else {
            NotBinary.push(1);
        }
    }
    return NotBinary;
}
function binaryToVal(Binary) {
    var Num = 0;
    var BitIter = 1;
    for (var I = 0; I < Binary.length; I++) {
        if (Binary[I] === 1) {
            Num += BitIter;
        }
        BitIter *= 2;
    }
    return Num;
}
function binaryLength(CharCode) {
    var Bits = 1;
    while (CharCode > 1) {
        Bits++;
        CharCode /= 2;
    }
    return Bits;
}
function ToBinary(CharCode, Length = binaryLength(CharCode)) {
    var Binary = [];
    for (var I = 0; I < Length; I++) {
        if (CharCode % 2 === 0) {
            Binary.push(0);
        }
        else if (CharCode % 2 === 1) {
            Binary.push(1);
        }
        CharCode /= 2;
        CharCode = Math.trunc(CharCode);
    }
    return Binary;
}
function stringToBinary(String) {
    var charCodeHold = String.charCodeAt(0);
    var BinaryWhole = ToBinary(charCodeHold).reverse();
    var HoldBinary = [];
    for (var I = 1; I < String.length; I++) {
        HoldBinary.length = 0;
        charCodeHold = String.charCodeAt(I);
        HoldBinary = ToBinary(charCodeHold,8).reverse();
        BinaryWhole = BinaryWhole.concat(HoldBinary);
    }
    return BinaryWhole;
}
function binaryToString(Binary) {
    var Output = "";
    var Hold = [];
    var Iterations = Binary.length / 8
    for (var I = 0; I < Iterations; I++) {
        Hold.length = 0;
        Hold = Binary.splice(0, 8).reverse();
        Output += String.fromCharCode(binaryToVal(Hold));
    }
    return Output;
}
function encryptFunc(Text) {
    var final = {
        "binary": ""
    }
    var BinArr = stringToBinary(Text);
    var BinString = "";
    for (var I = 1; I <= BinArr.length; I++) {
        BinString += String.fromCharCode(BinArr[I - 1] + 48);
        if (I % 8 === 0) {
            BinString += ' ';
        }
    }
    BinString = BinString.substring(0,BinString.length-1)
    final["binary"] = BinString
    return final;
}
function decryptFunc(Text) {
    var final = {
        "text": ""
    }
    Text = Text.replace(/ /g, '');
    var BinArr = [];
    for (var I = 0; I < Text.length; I++) {
        BinArr.push(Text.charCodeAt(I) - 48);
    }
    final["text"] = binaryToString(BinArr)
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
        return decryptFunc(data["binary"])
    }
    else
    {
        return "Error"
    }
}
function validateInput(action, data)
{
    const regExTest = new RegExp(/^[0-1 ]+$/)
    var Valid = false
    if(action==="encrypt")
    {
        Valid = data["text"].length !== 0 
    }
    else if(action==="decrypt")
    {
        Valid = (data["binary"].length !== 0 && regExTest.test(data["binary"]))
    }
    return Valid
}
module.exports = {
    processData,
    validateInput,
    config
}
