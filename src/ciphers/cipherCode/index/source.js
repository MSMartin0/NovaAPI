const fs = require('fs')
const path = require('path')
const config = JSON.parse(fs.readFileSync(path.resolve(__dirname,'config.json')))
function encryptFunc(Text) {
    var final = {
        "charList": "",
        "charAmt": "",
        "charPositions": ""
    }
    var Characters = [];
    var Positions = [];
    var CharList = [];
    var CharAmt = [];
    for (var I = 0; I < Text.length; I++) {
        Characters[I] = Text[I];
        Positions[I] = I;
    }
    for (var I = 0; I < Text.length - 1; I++) {
        for (var J = 0; J < Text.length - I - 1; J++) {
            if (Characters[J] < Characters[J + 1]) {
                var TempChar = Characters[J];
                var TempPos = Positions[J];
                Characters[J] = Characters[J + 1];
                Positions[J] = Positions[J + 1];
                Characters[J + 1] = TempChar;
                Positions[J + 1] = TempPos;
            }
        }
    }
    CharList.push(Characters[0]);
    CharAmt.push(1);
    var Found = false;
    var Index = 0;
    for (var I = 1; I < Text.length; I++) {
        Found = false;
        Index = 0;
        while (Index < CharList.length && !Found) {
            if (CharList[Index] === Characters[I]) {
                CharAmt[Index]++;
                Found = true;
            }
            else {
                Index++;
            }
        }
        if (!Found) {
            CharList.push(Characters[I]);
            CharAmt.push(1);
        }
    }
    final["charList"] = CharList
    final["charAmt"] = CharAmt
    final["charPositions"] = Positions
    return final;
}
function decryptFunc(Chars, Counts, Positions) {
    var final = {
        "text": ""
    }
    var Output = "";
    var Final = [];
    for (var I = 0; I < Counts.length; I++) {
        for (var J = 0; J < parseInt(Counts[I]); J++) {
            Output += Chars[I];
            Final.push(' ');
        }
    }
    for (var I = 0; I < Output.length; I++) {
        Final[Positions[I]] = Output.charAt(I);
    }
    Output = "";
    for (var I = 0; I < Final.length; I++) {
        Output += Final[I];
    }
    final["text"] = Output
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
        data = inputConversion(data)
        return decryptFunc(data["charList"], data["charAmt"], data["charPositions"])
    }
    else
    {
        return "Error"
    }
}
function inputConversion(data){

    var charList = data["charList"]
    var charAmt = data["charAmt"]
    var charPositions = data["charPositions"]
    if(typeof(data["charList"]) === "string")
    {
        var temp = charList
        temp = temp.split(',')
        charList = []
        for(var I = 0; I<temp.length; I++)
        {
            charList.push(temp[I])
        }
    }
    if(typeof(data["charAmt"]) === "string")
    {
        var temp = charAmt 
        temp = temp.split(',')
        charAmt = []
        for(var I = 0; I<temp.length; I++)
        {
            charAmt.push(parseInt(temp[I]))
        }
    }
    if(typeof(data["charPositions"]) === "string")
    {
        var temp = charPositions
        var temp = temp.split(',')
        charPositions = []
        for(var I = 0; I<temp.length; I++)
        {
            charPositions.push(parseInt(temp[I]))
        }
    }
    return {
        "charList": charList,
        "charAmt": charAmt,
        "charPositions": charPositions
    }
}
function validateInput(action, data)
{
    if(action === "encrypt")
    {
        return data["text"].length !== 0
    }
    else if(action === "decrypt")
    {
        var inputValidated = inputConversion(data)
        var tests = []
        tests.push(inputValidated["charList"].length !== 0) 
        tests.push(inputValidated["charAmt"].length !== 0)
        tests.push(inputValidated["charPositions"].length !== 0)
        tests.push(inputValidated["charList"].length === inputValidated["charAmt"].length)
        tests.push(inputValidated["charAmt"].reduce((a,b) => a+b, 0)===inputValidated["charPositions"].length)
        var holdArr = inputValidated["charPositions"].slice(0).sort((a,b) => a-b)
        var iter = 0
        var allPos = true
        while(iter<holdArr.length&&allPos)
        {
            allPos = (iter===holdArr[iter])
            iter++
        }
        tests.push(allPos)
        return true
    }
    return false
}
module.exports = {
    processData,
    validateInput,
    config
}